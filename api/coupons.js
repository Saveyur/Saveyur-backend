const FALLBACK_COUPONS = {
  'gap.com': [
    { code: 'TREAT', title: 'Extra 20% off your purchase' },
    { code: 'ALLFORYOU', title: 'Extra 15% off purchase' }
  ],
  'oldnavy.com': [
    { code: 'EXTRA', title: 'Extra % off your purchase' }
  ],
  'nike.com': [
    { code: 'EARLYBF', title: 'Early Black Friday savings' }
  ],
  'target.com': [
    { code: 'JOINSAVE', title: 'Save with Target Circle membership' }
  ],
  'amazon.com': [
    { code: '', title: 'Your session is affiliate-tracked' }
  ]
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const { domain } = req.query;
  
  if (!domain) {
    return res.status(400).json({ error: 'domain parameter required' });
  }

  const cleanDomain = domain.replace(/^(www\.|secure-www\.|m\.)/, '').toLowerCase();
  
  const coupons = FALLBACK_COUPONS[cleanDomain] || [
    { code: 'SAVE10', title: '10% off your order' },
    { code: 'FREESHIP', title: 'Free shipping on orders over $25' }
  ];
  
  return res.status(200).json({ coupons, domain: cleanDomain });
}
