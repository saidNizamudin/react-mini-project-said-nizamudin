import styles from './Login.module.css';
import React, { useState } from 'react';
import { Button } from '../../components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { UPDATE_LOGIN_FLAG } from '../../clients/user';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import hashPassword from '../../utilities/password';
import { ToastContainer, toast } from 'react-toastify';
import storage from '../../utilities/storage';

import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isVisible, setIsVisible] = useState(false);

	const navigate = useNavigate();

	const [updateLoginFlag, { loading }] = useMutation(UPDATE_LOGIN_FLAG, {
		onCompleted: (response) => {
			const data = response.update_user.returning;
			{
				if (data.length > 0) {
					storage.set('userId', data[0].id);
					storage.set('username', data[0].username);
					storage.set('isLoggedIn', true);
					navigate('/');
				} else {
					toast.error('Email or password is incorrect', {
						position: toast.POSITION.TOP_RIGHT,
					});
				}
			}
		},
		onError: (error) => {
			toast.error(error.message, {
				position: toast.POSITION.TOP_RIGHT,
			});
		},
	});

	const handleSubmit = () => {
		hashPassword(password).then((hashedPassword) => {
			updateLoginFlag({
				variables: { email, password: hashedPassword, flag: true },
			});
		});
	};

	return (
		<div>
			<div className={styles.containerLogin}>
				<div className={styles.wrapLogin}>
					<div className={styles.center}>
						<span className={styles.title}>Welcome</span>
					</div>
					<form className={styles.form}>
						<div className={styles.emailInput}>
							<input
								className={styles.input}
								id="email"
								type="text"
								name="email"
								placeholder="Email"
								value={email}
								onChange={(e) => {
									setEmail(e.target.value);
								}}
							/>
						</div>
						<div className={styles.passwordInput}>
							<input
								className={styles.input}
								id="password"
								placeholder="Password"
								type={isVisible ? 'text' : 'password'}
								name="pass"
								value={password}
								onChange={(e) => {
									setPassword(e.target.value);
								}}
							/>
							<div className={styles.icon}>
								<FontAwesomeIcon
									icon={isVisible ? faEyeSlash : faEye}
									onClick={() => {
										setIsVisible(!isVisible);
									}}
								/>
							</div>
						</div>
					</form>
					<Button type="Primary" clickFunction={handleSubmit}>
						{!loading ? 'Login' : <FontAwesomeIcon icon={faSpinner} spin />}
					</Button>
					<div className={styles.signUp}>
						<span>Don’t have an account?</span>
						<a className={styles.signUpLink} href="/sign-up">
							Sign Up
						</a>
					</div>
				</div>
			</div>
			<ToastContainer />
		</div>
	);
}
