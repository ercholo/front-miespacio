import { createSlice } from '@reduxjs/toolkit';

export const apiSlice = createSlice({
	name: 'api',
	initialState: {
		urlBase: 'https://p01-ws.hefame.es',
		urlFedicom: 'https://fedicom3.hefame.es',
		jwtFedicom: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlbXBsZWFkbyIsImF1ZCI6ImVtcGxlYWRvIiwiZXhwIjo5OTk5OTk5OTk5OTk5LCJpYXQiOjF9.WxBkwOuoZVPZptTlX2XuXvx0i91su_Gn9vspfeBM9FY"
	},
	reducers: {

	}
});
