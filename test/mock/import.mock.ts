export const mockImport: any = {
  __id: '6358ddcdd1058a2974e5b3eb',
  documents: ['6358e7ced1058a2974e5b59e'],
  pages: ['6358ddcdd1058a2974e5b3ed', '6358de35d1058a2974e5b47e'],
  inviteText:
    'Først og fremst ønsker vi deg hjertelig velkommen som boligkjøper, og gratulerer deg med at et av de største valgenei livet er tatt – kjøp av ny bolig. Vi vil gjøre vårt beste for at boligdrømmen skal gå i oppfyllelse, og for at prosessen frem til duovertar din bolig skal oppleves som en spennende og forventningsfull tid.',
  theme: {
    contact: {
      name: 'Emil Andreas Olsen',
      phone: '95760535',
      mail: 'emil@ludensgruppen.no',
      complaintEmail: ''
    },
    images: {
      logo: null,
      logoMedia: null,
      hero: null,
      heroMedia: null,
      fallback: null,
      fallbackMedia: null
    }
  },
  disabledModules: [],
  name: 'Base copy',
  myPageText: '',
  template: null,
  updatedAt: '2022-10-26T07:22:05.012Z',
  createdAt: '2022-10-26T07:12:13.749Z',
  periods: [
    {
      __id: '6358ddcdd1058a2974e5b3ee',
      name: 'Base copy',
      open: '2022-10-26T07:12:13.965Z',
      close: '2023-01-26T08:12:13.965Z'
    },
    {
      __id: '6358de8cd1058a2974e5b4a8',
      name: 'Prosjektperiode',
      open: '2022-09-30T22:00:03.000Z',
      close: '2099-10-31T22:59:13.000Z'
    }
  ],
  algorithms: [
    {
      __id: '6358ddcdd1058a2974e5b3f4',
      name: 'Standard',
      pipeline: [
        {
          applyTo: 'root',
          __id: '6358ddcdd1058a2974e5b3f7',
          label: 'Innkjøpspris',
          operation: 'base',
          value: 0
        }
      ]
    },
    {
      __id: '6358de50d1058a2974e5b487',
      name: 'Prosjektkalkyle',
      pipeline: [
        {
          applyTo: 'previousStep',
          __id: '6358de50d1058a2974e5b489',
          operation: 'base',
          label: 'Grunnpris'
        }
      ]
    }
  ],
  extraOptions: [
    {
      prerequisites: {
        totalCost: 1
      },
      quantity: 1,
      customDescription: '',
      unitCost: 1,
      __id: '6358e04cd1058a2974e5b592',
      product: null,
      variant: null,
      text: 'Endringsgebyr',
      producer: null,
      period: '6358de8cd1058a2974e5b4a8',
      algorithm: '6358de50d1058a2974e5b487',
      pickDate: '2022-10-26T07:22:52.250Z',
      params: []
    }
  ],
  notify: [],
  integrations: [],
  unitTemplates: [
    {
      __id: '6358dea2d1058a2974e5b4ba',
      _order_categories: [],
      name: 'Prosjekttilvalgliste',
      project: '6358ddcdd1058a2974e5b3eb',
      updatedAt: '2022-10-26T07:15:46.995Z',
      createdAt: '2022-10-26T07:15:46.995Z',
      blueprints: [],
      categories: [
        {
          isRoom: false,
          _order_sections: [],
          __id: '6358deabd1058a2974e5b4c4',
          name: 'Med velkommen',
          upsellTemplate: '6358ddcdd1058a2974e5b3ef',
          _orderID: '6358deabd1058a2974e5b4c6',
          sections: [
            {
              standard: false,
              multiSelect: false,
              displayType: 'default',
              _order_products: [],
              __id: '6358dec2d1058a2974e5b4ec',
              name: 'Pakke',
              period: '6358de8cd1058a2974e5b4a8',
              _orderID: '6358dec2d1058a2974e5b4ee',
              packages: [
                {
                  standard: false,
                  _product_order: [],
                  __id: '6358dec9d1058a2974e5b4f9',
                  name: 'Pakke',
                  description: '',
                  image: null,
                  imageMedia: null
                }
              ],
              assortments: [],
              products: [
                {
                  availableProducts: ['6358ddf1d1058a2974e5b448'],
                  measureUnitType: 'unit',
                  amount: 1,
                  standard: false,
                  labels: ['6358de0ed1058a2974e5b45e'],
                  __id: '6358def8d1058a2974e5b51e',
                  partOfPackage: '6358dec9d1058a2974e5b4f9',
                  text: '',
                  customTitle: '',
                  customDescription: '',
                  unitCost: 200,
                  variantPrices: [],
                  algorithm: '6358de50d1058a2974e5b487',
                  notifyWhenPicked: false,
                  onlyShowInSelection: false,
                  unitSizeParam: '',
                  consequenceParam: '',
                  supplier: null,
                  recommendation: '6358de05d1058a2974e5b454',
                  params: [
                    {
                      __id: '6358def8d1058a2974e5b520',
                      key: 'logic',
                      value: {
                        value: [
                          {
                            __id: '6358de0ed1058a2974e5b45e',
                            name: 'Prosjektmerkelapp'
                          }
                        ],
                        optionLabels: ['6358de0ed1058a2974e5b45e'],
                        type: 'hideProducts'
                      }
                    }
                  ],
                  product: '6358ddf1d1058a2974e5b448',
                  _orderID: '6358def8d1058a2974e5b521'
                }
              ]
            },
            {
              standard: false,
              multiSelect: false,
              displayType: 'default',
              _order_products: [],
              __id: '6358df1ad1058a2974e5b531',
              name: 'Assortement',
              period: '6358de8cd1058a2974e5b4a8',
              _orderID: '6358df1ad1058a2974e5b533',
              packages: [],
              assortments: [
                {
                  __id: '6358df30d1058a2974e5b568',
                  color: '#C9DAF8'
                }
              ],
              products: [
                {
                  availableProducts: ['5ae2cd0f948b6d632679cf45'],
                  measureUnitType: 'unit',
                  amount: 1,
                  standard: false,
                  labels: [],
                  __id: '6358df26d1058a2974e5b545',
                  text: '',
                  customTitle: '',
                  customDescription: '',
                  unitCost: 0,
                  variantPrices: [],
                  algorithm: '6358ddcdd1058a2974e5b3f4',
                  notifyWhenPicked: false,
                  onlyShowInSelection: false,
                  unitSizeParam: '',
                  consequenceParam: '',
                  supplier: null,
                  recommendation: null,
                  params: [],
                  product: '5ae2cd0f948b6d632679cf45',
                  _orderID: '6358df26d1058a2974e5b547',
                  partOfAssortment: '6358df30d1058a2974e5b568',
                  standardVariant: null
                },
                {
                  availableProducts: ['5ae2cd14948b6d632679d10f'],
                  measureUnitType: 'unit',
                  amount: 1,
                  standard: false,
                  labels: [],
                  __id: '6358df2cd1058a2974e5b55a',
                  text: '',
                  customTitle: '',
                  customDescription: '',
                  unitCost: 0,
                  variantPrices: [],
                  algorithm: '6358de50d1058a2974e5b487',
                  notifyWhenPicked: false,
                  onlyShowInSelection: false,
                  unitSizeParam: '',
                  consequenceParam: '',
                  supplier: null,
                  recommendation: null,
                  params: [],
                  product: '5ae2cd14948b6d632679d10f',
                  _orderID: '6358df2cd1058a2974e5b55c',
                  partOfAssortment: '6358df30d1058a2974e5b568',
                  standardVariant: null
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  content: [
    {
      __id: '6358ddcdd1058a2974e5b3ef',
      links: [],
      name: 'Velkommen',
      description:
        'For velkommen siden. Du kan endre innhold og linker under Innhold -> sider',
      text:
        "{'blocks':[{'key':'1s20o','text':'Først og fremst ønsker vi deg hjertelig velkommen som boligkjøper, og gratulerer deg med at et av de største valgene i livet er tatt – kjøp av ny bolig. Vi vil gjøre vårt beste for at boligdrømmen skal gå i oppfyllelse, og for at prosessen frem til du overtar din bolig skal oppleves som en spennende og forventningsfull tid.','type':'unstyled','depth':0,'inlineStyleRanges':[{'offset':1,'length':324,'style':'fontsize-18'}],'entityRanges':[],'data':{}},{'key':'3edfj','text':'Før du setter igang, anbefaler vi deg at du tar en gjennomgang av vår informasjon om tilvalgsprosessen. Dufinner diverse informasjon i boksene under. Der kan du også velge å starte tilvalgsprosessen, booke møter eller kontakte oss.','type':'unstyled','depth':0,'inlineStyleRanges':[],'entityRanges':[],'data':{}}],'entityMap':{}}",
      project: '6358ddcdd1058a2974e5b3eb',
      updatedAt: '2022-10-26T07:12:13.793Z',
      createdAt: '2022-10-26T07:12:13.793Z'
    },
    {
      __id: '6358de29d1058a2974e5b46e',
      links: [],
      name: 'Prosjektoppsalg',
      text:
        "{'blocks':[{'key':'e5345','text':'innhold','type':'unstyled','depth':0,'inlineStyleRanges':[],'entityRanges':[],'data':{}}],'entityMap':{}}",
      image: null,
      videoEmbed: '',
      project: '6358ddcdd1058a2974e5b3eb',
      updatedAt: '2022-10-26T07:13:45.108Z',
      createdAt: '2022-10-26T07:13:45.108Z'
    }
  ],
  products: [
    {
      __id: '6358ddf1d1058a2974e5b448',
      tags: [],
      documents: [],
      variants: [],
      name: 'Prosjektprodukt',
      title: '',
      description: '',
      productNumber: 'project-product',
      color: '',
      colorLabel: '',
      series: '',
      style: '',
      material: '',
      length: '',
      width: '',
      height: '',
      images: [],
      project: '6358ddcdd1058a2974e5b3eb',
      updatedAt: '2022-10-26T07:12:49.969Z',
      createdAt: '2022-10-26T07:12:49.969Z',
      likes: [],
      searchableName: 'prosjektprodukt'
    }
  ],
  recommendations: [
    {
      __id: '6358de05d1058a2974e5b454',
      text: '',
      image: null,
      imageMedia: null,
      name: 'Prosjektanbefaling',
      color: '#ff0000',
      title: 'Prosjektanbefaling',
      project: '6358ddcdd1058a2974e5b3eb',
      updatedAt: '2022-10-26T07:13:09.986Z',
      createdAt: '2022-10-26T07:13:09.986Z'
    }
  ],
  remotePages: [
    {
      __id: '6358de35d1058a2974e5b47e',
      showInMenu: false,
      summary: '',
      upsellTemplate: '6358de29d1058a2974e5b46e',
      name: 'Prosjektside',
      icon: 'important',
      project: '6358ddcdd1058a2974e5b3eb',
      updatedAt: '2022-10-26T07:13:57.043Z',
      createdAt: '2022-10-26T07:13:57.043Z',
      sections: [],
      slug: 'prosjektside'
    },
    {
      __id: '6358ddcdd1058a2974e5b3ed',
      showInMenu: true,
      summary: 'Velkommen side for Base copy',
      upsellTemplate: '6358ddcdd1058a2974e5b3ef',
      project: '6358ddcdd1058a2974e5b3eb',
      name: 'Velkommen',
      icon: 'welcome',
      sections: [],
      updatedAt: '2022-10-26T07:12:13.834Z',
      createdAt: '2022-10-26T07:12:13.834Z',
      slug: 'velkommen-71'
    }
  ],
  remoteOptionLabels: [
    {
      __id: '6358de0ed1058a2974e5b45e',
      name: 'Prosjektmerkelapp',
      project: '6358ddcdd1058a2974e5b3eb',
      updatedAt: '2022-10-26T07:13:18.449Z',
      createdAt: '2022-10-26T07:13:18.449Z'
    }
  ]
};
