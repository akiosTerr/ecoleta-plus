import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './style.css';
import logo from '../../assets/logo.svg';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import api from '../../services/api';
import axios from 'axios';

interface Item {
	id: number;
	title: string;
	image_url: string;
}

interface UF {
	sigla: string;
	nome: string;
}

interface City {
	nome: string;
}

const CreatePoint = () => {
	const [items, setItems] = useState<Item[]>([]);
	const [ufs, setUfs] = useState<UF[]>([]);
	const [cities, setCities] = useState<string[]>([]);
	const [selectedPositon, setSelectedPositon] = useState<[number, number]>([
		0,
		0,
	]);
	const [initalPosition, setInitalPosition] = useState<[number, number]>([
		0,
		0,
	]);
	const [selectedItems, setSelectedItems] = useState<number[]>([]);
	const [selectedUf, setSelectedUf] = useState('0');
	const [selectedCity, setSelectedCity] = useState('0');
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		whatsapp: '',
	});

	const history = useHistory();

	useEffect(() => {
		navigator.geolocation.getCurrentPosition((position) => {
			const { latitude, longitude } = position.coords;
			setInitalPosition([latitude, longitude]);
		});
	}, []);

	useEffect(() => {
		api.get('items').then((res) => {
			console.log(res);

			setItems(res.data);
		});
	}, []);

	useEffect(() => {
		axios
			.get<UF[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados/')
			.then((res) => {
				const ufNames = res.data.map((uf) => {
					return {
						sigla: uf.sigla,
						nome: uf.nome,
					};
				});
				console.log(ufNames);

				setUfs(ufNames);
			});
	}, []);

	useEffect(() => {
		console.log('changed to ' + selectedUf);
		axios
			.get<City[]>(
				`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
			)
			.then((res) => {
				const cityNames = res.data.map((city) => city.nome);
				setCities(cityNames);
			});
	}, [selectedUf]);

	const handleSelectUf = (event: ChangeEvent<HTMLSelectElement>) => {
		setSelectedUf(event.target.value);
	};

	const handleSelectCity = (event: ChangeEvent<HTMLSelectElement>) => {
		setSelectedCity(event.target.value);
	};

	const handleMapClick = (event: LeafletMouseEvent) => {
		console.log(event.latlng);
		setSelectedPositon([event.latlng.lat, event.latlng.lng]);
	};

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSelectItem = (id: number) => {
		const alreadySelected = selectedItems.findIndex((item) => item === id);

		if (alreadySelected >= 0) {
			const filteredItems = selectedItems.filter((item) => item !== id);
			setSelectedItems(filteredItems);
		} else {
			setSelectedItems([...selectedItems, id]);
		}
	};

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();

		const { email, name, whatsapp } = formData;
		const uf = selectedUf;
		const city = selectedCity;
		const [latitude, longitude] = selectedPositon;
		const items = selectedItems;

		const data = {
			email,
			name,
			whatsapp,
			uf,
			city,
			latitude,
			longitude,
			items,
		};

		api.post('points', data);

		alert('point created');
		history.push('/');
	};

	return (
		<div id='page-create-point'>
			<header>
				<img src={logo} alt='Ecoleta' />
				<Link to='/'>
					<FiArrowLeft />
					Voltar para Home
				</Link>
			</header>

			<form onSubmit={handleSubmit}>
				<h1>
					Cadastro do <br /> ponto de coleta
				</h1>

				<fieldset>
					<legend>
						<h2>dados</h2>
					</legend>

					<div className='field'>
						<label htmlFor='name'>Nome da entidade</label>
						<input
							onChange={handleInputChange}
							type='text'
							name='name'
							id='name'
						/>
					</div>

					<div className='field-group'>
						<div className='field'>
							<label htmlFor='email'>Email</label>
							<input
								onChange={handleInputChange}
								type='email'
								name='email'
								id='email'
							/>
						</div>
						<div className='field'>
							<label htmlFor='whatsapp'>Whatsapp</label>
							<input
								onChange={handleInputChange}
								type='text'
								name='whatsapp'
								id='whatsapp'
							/>
						</div>
					</div>
				</fieldset>
				<fieldset>
					<legend>
						<h2>Endereço</h2>
						<span>Selecione o endereço no mapa</span>
					</legend>
				</fieldset>

				<Map center={initalPosition} zoom={17} onClick={handleMapClick}>
					<TileLayer
						attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
						url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
					/>
					<Marker position={selectedPositon}></Marker>
				</Map>

				<div className='field-group'>
					<div className='field'>
						<label htmlFor='uf'>Estado (UF)</label>
						<select
							onChange={handleSelectUf}
							value={selectedUf}
							name='uf'
							id='uf'>
							{ufs.map((uf) => (
								<option key={uf.sigla} value={uf.sigla}>
									{`${uf.sigla} - ${uf.nome}`}
								</option>
							))}
						</select>
					</div>
					<div className='field'>
						<label htmlFor='city'>Cidade</label>
						<select
							value={selectedCity}
							onChange={handleSelectCity}
							name='city'
							id='city'>
							{cities.map((city) => (
								<option key={city} value={city}>
									{city}
								</option>
							))}
						</select>
					</div>
				</div>

				<fieldset>
					<legend>
						<h2>Ítems de coleta</h2>
						<span>Selecione um ou mais ítems abaixo</span>
					</legend>
					<ul className='items-grid'>
						{items.map((item) => (
							<li
								className={selectedItems.includes(item.id) ? 'selected' : ''}
								onClick={() => {
									handleSelectItem(item.id);
								}}
								key={item.id}>
								<img src={item.image_url} alt={item.title} />
								<span>{item.title}</span>
							</li>
						))}
					</ul>
				</fieldset>
				<button type='submit'>Cadastrar ponto de coleta</button>
			</form>
		</div>
	);
};

export default CreatePoint;
