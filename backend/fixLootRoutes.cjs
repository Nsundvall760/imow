const fs = require('fs');
const db = require('./db.json');

db.mapGuides.forEach(guide => {
  if (Array.isArray(guide.lootRoutes)) {
    guide.lootRoutes = guide.lootRoutes.filter(
      r => typeof r === 'object' && r !== null && r.title && r.image
    );
  }
});

fs.writeFileSync('./db.json', JSON.stringify(db, null, 2));
console.log('Cleaned up lootRoutes!'); 