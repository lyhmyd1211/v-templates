import request from '@/utils/request'
export function getWeather(params) {
	return request({
		url: 'https://free-api.heweather.net/s6/weather/forecast',
		method: 'get',
		params
	})
}