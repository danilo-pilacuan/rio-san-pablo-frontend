export default [
  'General',
  [
    {
      to: '/',
      icon: 'desktop-mac',
      label: 'Inicio'
    }
  ],
  'Administración',
  [
    {
      to: '/reportes',
      label: 'Reportes',
      icon: 'chart-line',
    },
    {
      to: '/rutas',
      label: 'Rutas',
      icon: 'table',
      hiddenFor:2
    },
    {
      to: '/fletes',
      label: 'Fletes',
      icon: 'truck',
      
    },
    {
      to: '/horarios',
      label: 'Horarios',
      icon: 'book-open-page-variant',
      
    },
    
    // {
    //   to: '/aportes',
    //   label: 'Aportes',
    //   icon: 'square-inc-cash'
    // },
    
    {
      to: '/socios',
      label: 'Socios y Colaboradores',
      icon: 'account-circle',
      hiddenFor:2
      //updateMark: true
    },
    {
      to: '/usuarios',
      label: 'Usuarios',
      icon: 'account',
      hiddenFor:2
      //updateMark: true
    },
    {
       to: '/unidades',
      label: 'Unidades',
      icon: 'bus',
      
    },
    {
       to: '/inventario',
      label: 'Inventario',
      icon: 'warehouse',
      
    },
    {
      to: '/imprimir',
      label: 'Imprimir',
      icon: 'printer',
      
    },    
  ],
  
]
