import Extra from './Extra';

import AboutPage from './pages/About';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';

import NotFoundPage from '../_common/pages/NotFound';

const ExtraRouter = [
	{
		...Extra,
		routes: [
			// { ...HomePage, path: '/', exact: true },
			{ ...AboutPage, path: '/about', exact: true },
			{ ...LoginPage, path: '/login', exact: true },
			{ ...SignupPage, path: '/signup', exact: true },
			// { ...ForgotPasswordPage, path: '/forgot_password', exact: true },
			// { ...ResetPasswordPage, path: '/reset_password', exact: true },
			// { ...SettingsPage, path: '/settings' },
			{ ...NotFoundPage }
		]
	}
];

export default ExtraRouter;
