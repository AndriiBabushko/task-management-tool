const Paths = {
  admin: '/admin',
  user: '/user',
  root: '/',
  login: '/login',
  logout: '/logout',
  signup: '/signup',
  account: 'account',
  settings: 'settings',
  users: 'users',
  tasks: 'tasks',
  groups: 'groups',
  tags: 'tags',
  categories: 'categories',
  roles: 'roles',
  group: 'groups/:groupID',
  task: 'tasks/:taskID',
  activation: '/account/activation',
  any: '*',
} as const;

export { Paths };
