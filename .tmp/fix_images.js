const fs = require('fs');

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/'Autum': '\.jpg'/g, "'Autum': '/images/autum.jpg'");
  content = content.replace(/'Deloviere': '\.jpg'/g, "'Deloviere': '/images/deloviere.jpg'");
  content = content.replace(/'Lunar Lover': '\.jpg'/g, "'Lunar Lover': '/images/lunar_lover.jpg'");
  content = content.replace(/'Idle Flyer': '\.jpg'/g, "'Idle Flyer': '/images/idle_flyer.jpg'");
  content = content.replace(/'Inn Count': '\.jpg'/g, "'Inn Count': '/images/inn_count.jpg'");
  content = content.replace(/'Midiaro': '\.jpg'/g, "'Midiaro': '/images/midiaro.jpg'");
  content = content.replace(/'Mountain Queen': '\.jpg'/g, "'Mountain Queen': '/images/mountain_queen.jpg'");
  content = content.replace(/'Golden Standard': '\.jpg'/g, "'Golden Standard': '/images/golden_standard.jpg'");
  content = content.replace(/'Febright': '\.jpg'/g, "'Febright': '/images/febright.jpg'");
  content = content.replace(/'Blue Squares': '\.jpg'/g, "'Blue Squares': '/images/blue_squares.jpg'");
  content = content.replace(/\|\| '\.jpg'/g, "|| '/images/autum.jpg'");
  content = content.replace(/<img src="\.jpg" alt="Autum"/g, '<img src="/images/autum.jpg" alt="Autum"');
  content = content.replace(/<img src="\.jpg" alt="Deloviere"/g, '<img src="/images/deloviere.jpg" alt="Deloviere"');
  content = content.replace(/<img src="\.jpg" alt="Lunar Lover"/g, '<img src="/images/lunar_lover.jpg" alt="Lunar Lover"');
  content = content.replace(/<img src="\.jpg" alt="Idle Flyer"/g, '<img src="/images/idle_flyer.jpg" alt="Idle Flyer"');
  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed', file);
}

fixFile('app/portal/client/dashboard/page.tsx');
fixFile('app/portal/trainer/dashboard/page.tsx');
fixFile('app/portal/trainer/stable/page.tsx');
