const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://qtuzpswxzengqoqqwtpt.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const newModels = [
    {
        id: `new_${Date.now()}_1`,
        name: 'Valentina',
        location: 'Europe | Spain | Madrid',
        url: 'https://www.distintas.net/escorts-trans/espana/valentina',
        bio: 'New premium escort in Madrid',
        photo: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%2Fid%2FOIP.xH6f7qK8KzPZy4M4M6F4XQHaLH%3Fpid%3DApi&f=1&ipt=1&ipo=images'
    },
    {
        id: `new_${Date.now()}_2`,
        name: 'Sofia',
        location: 'Americas | Colombia | Medellin',
        url: 'https://www.distintas.net/escorts-trans/colombia/sofia',
        bio: 'Hot trans model in Medellin',
        photo: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%2Fid%2FOIP.PzKkXp8uGvW_0QpU6Yq3bQHaLH%3Fpid%3DApi&f=1&ipt=1&ipo=images'
    }
];

async function addModels() {
    for (const model of newModels) {
        console.log(`Adding ${model.name}...`);
        await supabase.from('profiles').insert({
            id: model.id,
            name: model.name,
            location: model.location,
            url: model.url,
            bio: model.bio
        });
        await supabase.from('photos').insert({
            profile_id: model.id,
            photo_url: model.photo
        });
        console.log(`Added ${model.name}`);
    }
    console.log('Done adding new models');
}

addModels();
