'use client'
import "./login-cadastro.css";
import React, { useState } from "react";


import { useRouter } from "next/navigation";

const LoginCadastroPage = () => {
	const [isLogin, setIsLogin] = useState(true);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const router = useRouter();

	const handleLoginSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoggedIn(true);
	};

	const handleLogout = () => {
		setIsLoggedIn(false);
	};

	const handleGoHome = () => {
		router.push("/");
	};

	return (
		<div className="login-cadastro-bg">
			<h1 className="login-cadastro-title">Pet Farma</h1>
			<div className="login-cadastro-box">
				{!isLoggedIn ? (
					<>
						<div className="login-cadastro-toggle">
							<button
								type="button"
								className={`login-cadastro-btn${isLogin ? " active" : ""}`}
								onClick={() => setIsLogin(true)}
							>
								Login
							</button>
							<button
								type="button"
								className={`login-cadastro-btn${!isLogin ? " active" : ""}`}
								onClick={() => setIsLogin(false)}
							>
								Cadastro
							</button>
						</div>
						{isLogin ? (
							<form className="login-cadastro-form" onSubmit={handleLoginSubmit}>
								<label>E-mail</label>
								<input type="email" placeholder="Digite seu e-mail" />
								<label>Senha</label>
								<input type="password" placeholder="Digite sua senha" />
								<button type="submit">Entrar</button>
							</form>
						) : (
							<form className="login-cadastro-form">
								<label>Nome</label>
								<input type="text" placeholder="Digite seu nome" />
								<label>E-mail</label>
								<input type="email" placeholder="Digite seu e-mail" />
								<label>Senha</label>
								<input type="password" placeholder="Crie uma senha" />
								<button type="submit">Cadastrar</button>
							</form>
						)}
					</>
				) : (
					<div className="login-cadastro-welcome">
						<h2>Bem-vindo!</h2>
						<button type="button" onClick={handleGoHome} style={{ marginRight: "10px" }}>
							Ir para página inicial
						</button>
						<button type="button" onClick={handleLogout}>
							Sair
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default LoginCadastroPage;
