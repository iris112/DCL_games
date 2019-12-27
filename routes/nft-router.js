const dbNFT = require('../db/dbNFT');

module.exports = app => {
  app.get('/nft/vehicle/:token_id', (req, res) => {
    const tokenId = parseInt(req.params.token_id).toString();
    const vehicle = dbNFT[tokenId];

    const data = {
      name: vehicle.name,
      external_url: vehicle.external_url,
      image: vehicle.image,
      background_color: vehicle.background_color,
      attributes: [
        {
          trait_type: vehicle.attributes[0][1].trait_type,
          value: vehicle.attributes[0][1].value
        },
        {
          trait_type: vehicle.attributes[0][2].trait_type,
          value: vehicle.attributes[0][2].value
        },
        {
          trait_type: vehicle.attributes[0][3].trait_type,
          value: vehicle.attributes[0][3].value
        },
        {
          display_type: vehicle.attributes[0][4].display_type,
          trait_type: vehicle.attributes[0][4].trait_type,
          value: vehicle.attributes[0][4].value,
          max_value: vehicle.attributes[0][4].max_value
        },
        {
          display_type: vehicle.attributes[0][5].display_type,
          trait_type: vehicle.attributes[0][5].trait_type,
          value: vehicle.attributes[0][5].value,
          max_value: vehicle.attributes[0][5].max_value
        },
        {
          display_type: vehicle.attributes[0][6].display_type,
          trait_type: vehicle.attributes[0][6].trait_type,
          value: vehicle.attributes[0][6].value,
          max_value: vehicle.attributes[0][6].max_value
        },
        {
          display_type: vehicle.attributes[0][7].display_type,
          trait_type: vehicle.attributes[0][7].trait_type,
          value: vehicle.attributes[0][7].value,
          max_value: vehicle.attributes[0][7].max_value
        },
        {
          display_type: vehicle.attributes[0][8].display_type,
          trait_type: vehicle.attributes[0][8].trait_type,
          value: vehicle.attributes[0][8].value,
          max_value: vehicle.attributes[0][8].max_value
        }
      ]
    };

    res.send(data);
  });
};
