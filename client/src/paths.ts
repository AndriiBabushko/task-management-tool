const Paths = {
  home: '/',
  login: '/login',
  logout: '/logout',
  signup: '/signup',
  account: '/account',
  settings: '/settings',
  task: '/tasks/:taskID',
  tasks: '/tasks',
  group: '/groups/:groupID',
  groups: '/groups',
  activation: '/account/activation',
} as const;

export { Paths };
