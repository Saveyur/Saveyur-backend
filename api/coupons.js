const CJ_API_KEY = 'YOUR_CJ_API_KEY';
const WEBSITE_ID = 'YOUR_CJ_WEBSITE_ID';

const FALLBACK_COUPONS = {
'gap.com': [
    { code: 'TREAT', title: 'Extra 20% off your purchase' },
    { code: 'ALLFORYOU', title: 'Extra 15% off purchase' }
  ],
  'oldnavy.com': [
    { code: 'ONFALL', title: '40% off your purchase' }
  ],
  'nike.com': [
    { code: 'NIKERUN', title: '20% off running gear' }
  ],
  'target.com': [
    { code: 'TARGET10', title: '10% off your order' }
  ],
  'amazon.com': [
    { code: '', title: 'Your session is affiliate-tracked — you earn on every purchase' }
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
  
  // Return fallback coupons for now — CJ integration coming next
  const coupons = FALLBACK_COUPONS[cleanDomain] || [
    { code: 'SAVE10', title: '10% off your order' },
    { code: 'FREESHIP', title: 'Free shipping on orders over $25' }
  ];
  
  return res.status(200).json({ coupons, domain: cleanDomain });
}
