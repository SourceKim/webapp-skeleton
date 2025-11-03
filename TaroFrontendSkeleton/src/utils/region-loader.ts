
import provinceJson from '@/assets/regions/province.json'
import cityJson from '@/assets/regions/city.json'
import countryJson from '@/assets/regions/country.json'
import townJson from '@/assets/regions/town.json'

export const getPronvinceList = () => {
  return provinceJson
}

export const getCityList = (provinceId: string) => {
  const cities = cityJson[provinceId]
  return cities
}

export const getCountryList = (cityId: string) => {
  const countries = countryJson[cityId]
  return countries
}

export const getTownList = (countryId: string) => {
  const towns = townJson[countryId]
  return towns
}
