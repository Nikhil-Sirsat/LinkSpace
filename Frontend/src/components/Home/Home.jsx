import StoryList from '../Story/StoryList';
import HomePostFeedCard from "./HomePostsFeed";
import HomeSuggest from '../Suggestions/HomeSuggest';
import { Box } from '@mui/material';

export default function Home() {
    return (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, width: '100%' }}>
            <Box sx={{ width: { xs: '100%', md: '50%' }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <StoryList />
                <Box sx={{ width: { xs: '90%', md: '65%' }, alignItems: 'center', justifyContent: 'center', display: { xs: 'none', md: 'flex' } }}>
                    <HomeSuggest />
                </Box>
            </Box>
            <HomePostFeedCard />
            <Box sx={{ width: '90%', alignItems: 'center', justifyContent: 'center', display: { xs: 'flex', md: 'none' }, margin: 'auto' }}>
                <HomeSuggest />
            </Box>
        </Box>
    );
}