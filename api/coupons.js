const CJ_API_KEY = 'xv351AZdtwg-PSLWar5gP9HETA';
const WEBSITE_ID = '101908807';

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
  'walmart.com': [
    { code: 'TRIPLE15', title: '15% off your order' },
    { code: 'DOUBLE10', title: '10% off your order' }
  ],
  'hm.com': [
    { code: 'HMTEXTS20', title: '20% off your purchase' },
    { code: 'APP20', title: '20% off via H&M app' }
  ],
  'dsw.com': [
    { code: 'HEATWAVE', title: 'Extra savings on your order' },
    { code: 'FALLFORDSW', title: 'Fall savings at DSW' }
  ],
  'hotels.com': [
    { code: 'NEW10', title: '10% off your first booking' }
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
  const storeName = cleanDomain.replace('.com', '').replace('.net', '').replace('.org', '');

  try {
    const cjUrl = `https://link-search.api.cj.com/v2/link-search?website-id=${WEBSITE_ID}&advertiser-ids=joined&keywords=${storeName}&promotion-type=coupon&records-per-page=5`;
    
    const cjResponse = await fetch(cjUrl, {
      headers: { 'Authorization': `Bearer ${CJ_API_KEY}` }
    });

    const xmlText = await cjResponse.text();
    
    const coupons = [];
    const linkMatches = xmlText.matchAll(/<link>([\s\S]*?)<\/link>/g);
    
    for (const match of linkMatches) {
      const block = match[1];
      const codeMatch = block.match(/<coupon-code>(.*?)<\/coupon-code>/);
      const descMatch = block.match(/<description>(.*?)<\/description>/);
      const code = codeMatch ? codeMatch[1].trim() : '';
      const desc = descMatch ? descMatch[1].trim() : '';
      if (code && code.length > 0) {
        coupons.push({ code, title: desc || `Use code ${code}` });
      }
    }

    if (coupons.length > 0) {
      return res.status(200).json({ coupons, domain: cleanDomain, source: 'cj' });
    }
  } catch(e) {
    console.log('CJ API error:', e.message);
  }

  const fallback = FALLBACK_COUPONS[cleanDomain] || [
    { code: 'SAVE10', title: '10% off your order' },
    { code: 'FREESHIP', title: 'Free shipping on orders over $25' }
  ];

  return res.status(200).json({ coupons: fallback, domain: cleanDomain, source: 'fallback' });
}
