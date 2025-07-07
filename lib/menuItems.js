const menuItems = [
	{
		id: 1,
		icon: "<PersonAddIcon fontSize='small' />",
		label: 'Home Page',
		href: '/',
		visible: ['admin', 'teacher', 'student', 'parent'],
	},
	{
		id: 2,
		icon: "<PersonAddIcon fontSize='small' />",
		label: 'Add Register',
		href: '/members/create',
		visible: ['admin', 'teacher'],
	},
	{
		id: 3,
		icon: "<PersonAddIcon fontSize='small' />",
		label: 'List Members',
		href: '/members',
		visible: ['admin', 'teacher'],
	},
	{
		id: 4,
		icon: "<PersonAddIcon fontSize='small' />",
		label: 'Login',
		href: '/login',
		visible: ['admin', 'teacher'],
	},
];

export default menuItems;
