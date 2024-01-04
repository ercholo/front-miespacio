
import { Box, Typography } from "@mui/material";
import FeedNoticias from './FeedNoticias';

export default function PantallaNoticias() {

	return <>
		<Box sx={{ m: 'auto' }}>
			<Typography variant="h4" sx={{ m: 'auto', mb: 2 }}>Noticias</Typography>
		</Box>
		<FeedNoticias />
	</>


}