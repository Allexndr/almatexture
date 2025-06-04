export interface District {
  id: string;
  name: string;
  description: string;
  imagePath?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  boundaries?: Array<{
    lat: number;
    lng: number;
  }>;
}

const districts: District[] = [
  {
    id: '1',
    name: 'Алмалинский',
    description: 'Центральный район города, известный своими историческими зданиями, культурными объектами и развитой инфраструктурой.',
    imagePath: '/images/districts/almaly.jpg',
    coordinates: {
      lat: 43.25,
      lng: 76.95
    }
  },
  {
    id: '2',
    name: 'Медеуский',
    description: 'Район у подножия гор Заилийского Алатау, включающий высокогорный комплекс Медеу и Шымбулак, а также элитные жилые кварталы.',
    imagePath: '/images/districts/medeu.jpg',
    coordinates: {
      lat: 43.18,
      lng: 77.05
    }
  },
  {
    id: '3',
    name: 'Бостандыкский',
    description: 'Один из крупнейших и динамично развивающихся районов города с множеством новостроек и университетов.',
    imagePath: '/images/districts/bostandyk.jpg',
    coordinates: {
      lat: 43.22,
      lng: 76.87
    }
  },
  {
    id: '4',
    name: 'Ауэзовский',
    description: 'Густонаселенный район с развитой жилой застройкой и торговой инфраструктурой.',
    imagePath: '/images/districts/auezov.jpg',
    coordinates: {
      lat: 43.24,
      lng: 76.85
    }
  },
  {
    id: '5',
    name: 'Турксибский',
    description: 'Исторический промышленный район на севере города с уникальным сочетанием старой и новой архитектуры.',
    imagePath: '/images/districts/turksib.jpg',
    coordinates: {
      lat: 43.33,
      lng: 76.94
    }
  },
  {
    id: '6',
    name: 'Алатауский',
    description: 'Молодой, быстро развивающийся район в западной части города с новыми жилыми комплексами.',
    imagePath: '/images/districts/alatau.jpg',
    coordinates: {
      lat: 43.34,
      lng: 76.91
    }
  },
  {
    id: '7',
    name: 'Жетысуский',
    description: 'Район с богатым культурным наследием и историческими достопримечательностями.',
    imagePath: '/images/districts/zhetysu.jpg',
    coordinates: {
      lat: 43.29,
      lng: 76.96
    }
  },
  {
    id: '8',
    name: 'Наурызбайский',
    description: 'Самый молодой район города, расположенный в предгорьях, с активно развивающейся инфраструктурой.',
    imagePath: '/images/districts/nauryzbay.jpg',
    coordinates: {
      lat: 43.19,
      lng: 76.84
    }
  }
];

export default districts; 