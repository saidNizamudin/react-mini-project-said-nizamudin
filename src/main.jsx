import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProSidebarProvider } from 'react-pro-sidebar';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import Content from './Content';
import { Home, CreateTask, CreateList, Login, Register } from './pages';

ReactDOM.createRoot(document.getElementById('root')).render(
	<ApolloProvider client={client}>
		<React.StrictMode>
			<ProSidebarProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/sign-in" element={<Login />}></Route>
						<Route path="/sign-up" element={<Register />}></Route>
						<Route
							path="/"
							element={
								<Content>
									<Home />
								</Content>
							}
						></Route>
						<Route
							path="/create-task"
							element={
								<Content>
									<CreateTask />
								</Content>
							}
						></Route>
						<Route
							path="/create-list"
							element={
								<Content>
									<CreateList />
								</Content>
							}
						></Route>
					</Routes>
				</BrowserRouter>
			</ProSidebarProvider>
		</React.StrictMode>
	</ApolloProvider>
);
