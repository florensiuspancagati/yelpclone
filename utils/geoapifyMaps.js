const ExpressError = require('./ExpressError');
const baseUrl = `https://api.geoapify.com/v1`;
const apiKey = `f187c03b16d743d7a894483831561c02`;

const geoapify = async (address) => {
  const url = `${baseUrl}/geocode/search?text=${address}&limit=1&apiKey=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.features && data.features.length > 0) {
      return data.features[0]; // 🟢 Return seluruh info lokasi
    } else {
      throw new ExpressError('Alamat tidak ditemukan.', 404);
    }

  } catch (error) {
    throw new ExpressError(error.message, 500);
  }
};

const geometry = async (address) => {
    try {
        const position = await geoapify(address);
        return {
            type: 'Point',
            coordinates: position.geometry.coordinates
        }
    } catch (error) {
        throw new ExpressError(error.message, 500);
    }
};

module.exports = {
    geoapify,
    geometry
};