export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export const categories: Category[] = [
  { id: 'saltados_clasicos', name: 'Saltados Clasicos', image: 'https://lh3.googleusercontent.com/d/1rAxHRslNNIi7x6BBDdEQZ9xovcnZkJvS' },
  { id: 'ensalada_papas', name: 'Con Ensalada y papas', image: 'https://lh3.googleusercontent.com/d/1E9kTM5khmO6GtJOWfTZOUmsFSTlcLFZG' },
  { id: 'con_ensalada', name: 'Con Ensalada', image: 'https://lh3.googleusercontent.com/d/18UBCyingW8fS1gq5UR4L3hAHQncmouG2' },
  { id: 'chaufa_acompanante', name: 'Chaufa y Acompañante', image: 'https://lh3.googleusercontent.com/d/1_BxDG_Vm7AbcgiywQfmZMOkBxEhL-N22' },
  { id: 'chaufa', name: 'Chaufa', image: 'https://lh3.googleusercontent.com/d/16qYrmH8gClBdIbXsxmRwdarsP3a1w-60' },
  { id: 'promociones', name: 'Promociones', image: 'https://thumbs.dreamstime.com/b/concepto-para-un-cartel-publicitario-durante-las-promociones-una-tienda-de-bricolaje-publicidad-la-bandera-en-el-sector-diy-143733557.jpg' },
  { id: 'tallarin_verde', name: 'Tallarín verde', image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/LKE40kotnhmQQ7gKvJsF.jpg' },
  { id: 'tallarin_huancaina', name: 'Tallarín ala huancaína', image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/mAcUb4SHmhyAb0nZ0kpP.jpg' },
  { id: 'tallarin_saltado', name: 'Tallarín saltado', image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/7Sj2JbE9qQNbddSvUC3O.jpg' },
  { id: 'monstrito', name: 'Monstrito', image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/0LovX9dZhECw37cVdCJ4.jpg' },
  { id: 'refrescos', name: 'Refrescos', image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/lc1pWKk4iVflYQZFaCAH.jpeg' },
  { id: 'cervezas', name: 'Cervezas', image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/SuArD4botADlqaJNOcNR.jpeg' }
];

export const menuItems: MenuItem[] = [
  // --- SALTADOS CLASICOS ---
  {
    id: 'saltado_chancho',
    name: 'Saltado de Chancho',
    description: '',
    price: 11.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/mfzim8FV2jzCk6rGGK3p.jpg',
    category: 'saltados_clasicos'
  },
  {
    id: 'saltado_pollo',
    name: 'Saltado de Pollo',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/ZQCvJ8FYxK3JnEO3wFtB.jpg',
    category: 'saltados_clasicos'
  },
  {
    id: 'lomo_saltado',
    name: 'Lomo Saltado',
    description: '',
    price: 12.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/Yetc3WeitAkz6MeFZy3Q.jpg',
    category: 'saltados_clasicos'
  },
  {
    id: 'saltado_dos_sabores',
    name: 'Saltado Dos Sabores',
    description: '',
    price: 13.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/RzziFAq0KmMBWInw6mfc.jpg',
    category: 'saltados_clasicos'
  },
  {
    id: 'saltado_tres_sabores',
    name: 'Saltado Tres Sabores',
    description: '',
    price: 15.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/SNmKoqak6FlGWb9EM8QP.jpg',
    category: 'saltados_clasicos'
  },

  // --- CON ENSALADA Y PAPAS ---
  {
    id: 'ensalada_papa_pollo_parrilla',
    name: 'Ensalada papa y pollo a la parrilla',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/KR8B01ENt8cs5Tjg7WGJ.jpg',
    category: 'ensalada_papas'
  },
  {
    id: 'ensalada_papa_churrasco',
    name: 'Ensalada papa con churrasco',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/9kjct8elHFyonZubP5WL.jpg',
    category: 'ensalada_papas'
  },
  {
    id: 'ensalada_papa_anticucho',
    name: 'Ensalada papa con anticucho',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/byEJe8crvxr0fZfo1vl3.jpg',
    category: 'ensalada_papas'
  },
  {
    id: 'ensalada_papa_mollejitas',
    name: 'Ensalada papa con mollejitas',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/Ly5Vmea8pt0DZsHLb2Fo.jpg',
    category: 'ensalada_papas'
  },
  {
    id: 'ensalada_papa_chuleta',
    name: 'Ensalada papa con chuleta',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/dnKUsP4wE5LKCTp3Zut1.jpg',
    category: 'ensalada_papas'
  },
  {
    id: 'ensalada_papa_alitas',
    name: 'Ensalada papa con alitas',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/R2h0FGIdKeZnmByRepJy.jpg',
    category: 'ensalada_papas'
  },
  {
    id: 'ensalada_papa_broaster',
    name: 'Ensalada papa con broaster',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/JWPZ49tgmYyi06UzKkRi.jpg',
    category: 'ensalada_papas'
  },

  // --- CON ENSALADA ---
  {
    id: 'ensalada_pollo_parrilla',
    name: 'Ensalada con pollo a la parrilla',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/AEUkgpG7yhInTOzdERVW.jpg',
    category: 'con_ensalada'
  },
  {
    id: 'ensalada_churrasco',
    name: 'Ensalada con churrasco',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/oc8w51NL9RDN9CiP8oPC.jpg',
    category: 'con_ensalada'
  },
  {
    id: 'ensalada_chuleta',
    name: 'Ensalada con chuleta',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/EI8Zv2IRifRVcvPF86iL.jpg',
    category: 'con_ensalada'
  },
  {
    id: 'ensalada_anticucho',
    name: 'Ensalada con anticucho',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/cr4g0F8a3El1el6iJ5Mq.jpg',
    category: 'con_ensalada'
  },
  {
    id: 'ensalada_mollejitas',
    name: 'Ensalada con mollejitas',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/Y18vbHaFHb2shUtcv5hW.jpg',
    category: 'con_ensalada'
  },
  {
    id: 'ensalada_broaster',
    name: 'Ensalada con broaster',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/cSoza1CB7b7K86folhEf.jpg',
    category: 'con_ensalada'
  },
  {
    id: 'ensalada_alitas',
    name: 'Ensalada con alitas',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/ihhlRLt6tiCn0dt9b2TU.jpg',
    category: 'con_ensalada'
  },

  // --- CHAUFA Y ACOMPAÑANTE ---
  {
    id: 'chaufa_alita',
    name: 'Chaufa con alita',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/kI6WARsru2meQjaKblEB.jpg',
    category: 'chaufa_acompanante'
  },
  {
    id: 'chaufa_pollo_parrilla',
    name: 'Chaufa con pollo a la parrilla',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/HuJmIFB82UEOfJJvavaW.jpg',
    category: 'chaufa_acompanante'
  },
  {
    id: 'chaufa_broaster',
    name: 'Chaufa con broaster',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/6TdGiPFnSlW0eCAcUdn5.jpg',
    category: 'chaufa_acompanante'
  },
  {
    id: 'chaufa_chuleta',
    name: 'Chaufa con chuleta',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/C4xgCoCrvBoBiC6T9elV.jpg',
    category: 'chaufa_acompanante'
  },
  {
    id: 'chaufa_churrasco',
    name: 'Chaufa con churrasco',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/vNB8JnjNCS8mfJ07hSi8.jpg',
    category: 'chaufa_acompanante'
  },
  {
    id: 'chaufa_anticucho',
    name: 'Chaufa con anticucho',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/6hu9qYs0vnFy2kEhTOHp.jpg',
    category: 'chaufa_acompanante'
  },
  {
    id: 'chaufa_mollejitas',
    name: 'Chaufa con mollejitas',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/bcU8U4NhJSdpU3BfPmD2.jpg',
    category: 'chaufa_acompanante'
  },

  // --- CHAUFA ---
  {
    id: 'chaufa_pollo',
    name: 'Chaufa de pollo',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/fsV3lW7rx4ny2zFfwo78.jpg',
    category: 'chaufa'
  },
  {
    id: 'chaufa_chancho',
    name: 'Chaufa de chancho',
    description: '',
    price: 11.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/bQQEsiUW2gjaoP2XFpgr.jpg',
    category: 'chaufa'
  },
  {
    id: 'chaufa_carne',
    name: 'Chaufa de carne',
    description: '',
    price: 11.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/8uqDGnGHkq39GFlf5Nlt.jpg',
    category: 'chaufa'
  },
  {
    id: 'chaufa_dos_sabores',
    name: 'Chaufa dos sabores',
    description: '',
    price: 13.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/0BqeALlpFcDvUXeYf4lc.jpg',
    category: 'chaufa'
  },
  {
    id: 'chaufa_tres_sabores',
    name: 'Chaufa tres sabores',
    description: '',
    price: 15.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/riqf8UR7eDK1qh6XNTpA.jpg',
    category: 'chaufa'
  },

  // --- PROMOCIONES ---


  // --- TALLARIN VERDE ---
  {
    id: 'tallarin_verde_molleja',
    name: 'Tallarín verde con molleja',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/voPPxn92ilJOCoOnJE36.jpg',
    category: 'tallarin_verde'
  },
  {
    id: 'tallarin_verde_anticucho',
    name: 'Tallarín verde con anticucho',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/VoOeDg5XfWNRA1qgW5d5.jpg',
    category: 'tallarin_verde'
  },
  {
    id: 'tallarin_verde_pollo_parrilla',
    name: 'Tallarín verde con pollo ala parrilla',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/l6kdz093VlXrhtNynilN.jpg',
    category: 'tallarin_verde'
  },
  {
    id: 'tallarin_verde_pollo_broaster',
    name: 'Tallarín verde con pollo broaster',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/zGLNY1oc32TlZOy8nzQN.jpg',
    category: 'tallarin_verde'
  },
  {
    id: 'tallarin_verde_chuleta',
    name: 'Tallarín verde con chuleta',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/7FCrdmNQb9Zaa6drTPxd.jpg',
    category: 'tallarin_verde'
  },
  {
    id: 'tallarin_verde_churrasco',
    name: 'Tallarín verde con churrasco',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/C2JjbXbp9p3gW08AcSTj.jpg',
    category: 'tallarin_verde'
  },
  {
    id: 'tallarin_verde_alitas',
    name: 'Tallarín verde con alitas',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/jiLNnpriLoEepX0gYmzT.jpg',
    category: 'tallarin_verde'
  },

  // --- TALLARIN ALA HUANCAINA ---
  {
    id: 'tallarin_huancaina_anticucho',
    name: 'Tallarín ala huancaína con anticucho',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/1rPjj02GT3ZCNYOdlaeF.jpg',
    category: 'tallarin_huancaina'
  },
  {
    id: 'tallarin_huancaina_mollejas',
    name: 'Tallarín ala huancaína con mollejas',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/3p95zmAgrV2F0etiY1bF.jpg',
    category: 'tallarin_huancaina'
  },
  {
    id: 'tallarin_huancaina_pollo_parrilla',
    name: 'Tallarín ala huancaína con pollo ala parrilla',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/YXxK4V6A0BXZuUKEG8wC.jpg',
    category: 'tallarin_huancaina'
  },
  {
    id: 'tallarin_huancaina_chuleta',
    name: 'Tallarin ala huancaína con chuleta',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/bQO7ZWftHN93gGk8NoZM.jpg',
    category: 'tallarin_huancaina'
  },
  {
    id: 'tallarin_huancaina_churrasco',
    name: 'Tallarín ala huancaína con churrasco',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/OpX9tUKmascxcQKD9zGm.jpg',
    category: 'tallarin_huancaina'
  },
  {
    id: 'tallarin_huancaina_pollo_broaster',
    name: 'Tallarín ala huancaína con pollo broaster',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/FKegWgQxLuyR2BPIjwLN.jpg',
    category: 'tallarin_huancaina'
  },
  {
    id: 'tallarin_huancaina_alitas',
    name: 'Tallarín a la huancaína con alitas',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/JBWOIgMt6csZQY4Nclg8.jpg',
    category: 'tallarin_huancaina'
  },

  // --- TALLARIN SALTADO ---
  {
    id: 'tallarin_saltado_pollo',
    name: 'Tallarín saltado de pollo',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/AnlbH5gjVBnEQkYL8FAd.jpg',
    category: 'tallarin_saltado'
  },
  {
    id: 'tallarin_saltado_chancho',
    name: 'Tallarín saltado de chancho',
    description: '',
    price: 11.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/5Oaj3WHqCpFLAKvDeyc8.jpg',
    category: 'tallarin_saltado'
  },
  {
    id: 'tallarin_saltado_carne',
    name: 'Tallarín saltado de carne',
    description: '',
    price: 11.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/W5ZO2HANfFTiUPOROeYB.jpg',
    category: 'tallarin_saltado'
  },
  {
    id: 'tallarin_saltado_dos_sabores',
    name: 'Tallarín saltado dos sabores',
    description: '',
    price: 13.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/ip9eZ4CFyar8NXXAYkJH.jpg',
    category: 'tallarin_saltado'
  },
  {
    id: 'tallarin_saltado_tres_sabores',
    name: 'Tallarín saltado tres sabores',
    description: '',
    price: 15.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/iq5aPJxuREVikZWYeSWW.jpg',
    category: 'tallarin_saltado'
  },

  // --- MONSTRITO ---
  {
    id: 'monstrito_pollo_parrilla',
    name: 'Monstrito con pollo a la parrilla',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/3551AtlAiAZ16fM9CTKD.jpg',
    category: 'monstrito'
  },
  {
    id: 'monstrito_chuleta',
    name: 'Monstrito con chuleta',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/fCJM7ll8drhhgMlAqEOa.jpg',
    category: 'monstrito'
  },
  {
    id: 'monstrito_churrasco',
    name: 'Monstrito con churrasco',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/JejEiykdZt5CyplHHfhc.jpg',
    category: 'monstrito'
  },
  {
    id: 'monstrito_anticucho',
    name: 'Monstrito con anticucho',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/M10wsfcKWKKl0FWr845w.jpg',
    category: 'monstrito'
  },
  {
    id: 'monstrito_molleja',
    name: 'Monstrito con molleja',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/aoaU8MwCrEcLJ2QKxm2J.jpg',
    category: 'monstrito'
  },
  {
    id: 'monstrito_broaster',
    name: 'Monstrito con broaster',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/qZVcvNiwHGDdOtAae32l.jpg',
    category: 'monstrito'
  },
  {
    id: 'monstrito_alitas',
    name: 'Monstrito con alitas',
    description: '',
    price: 10.00,
    image: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/lor89Mci1nwYS0Pe0bW8.jpg',
    category: 'monstrito'
  }
];
