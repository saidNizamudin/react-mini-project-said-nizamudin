import styles from './Login.module.css';
import React, { useState } from 'react';
import { Button } from '../../components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isVisible, setIsVisible] = useState(false);
	const navigate = useNavigate();

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
					<Button type="Primary">Login</Button>
					<div className={styles.signUp}>
						<span>Don’t have an account?</span>
						<a className={styles.signUpLink} href="/sign-up">
							Sign Up
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
