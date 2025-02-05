
import { useState, useEffect, useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import { AppBar, Tabs, Tab, Typography, Box } from '@mui/material';
import ProfilePostGreed from './ProfilePostGreed.jsx';
import SavedPostGrid from './SavedPostsGreed.jsx';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AppsIcon from '@mui/icons-material/Apps';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import axiosInstance from '../../AxiosInstance.jsx';
import NotStartedIcon from '@mui/icons-material/NotStarted';
import TaggUserPostGrid from './TaggUserPostGreed.jsx';
import PostGridSkeleton from '../Skeletons/PostGridSkeleton.jsx';
import { ThemeContext } from "../../context/ThemeContext";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 3 }}>
                    <Box>{children}</Box>
                </Box>
            )}
        </div>
    );
}

export default function FullWidthTabs({ posts, CurrUser, profileUser }) {
    const theme = useTheme();
    const [value, setValue] = useState(0);
    const [savedPosts, setSavedPosts] = useState([]);
    const [taggPosts, setTaggPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { mode } = useContext(ThemeContext);

    useEffect(() => {
        if (profileUser && profileUser._id) {
            const fetchPosts = async () => {
                try {
                    const savedPostResponse = await axiosInstance.get(`/api/savedPost/saved-posts`);
                    const taggPostsResponse = await axiosInstance.get(`/api/post/tagged/${profileUser._id}`);
                    // console.log(taggPostsResponse.data.posts);
                    setTaggPosts(taggPostsResponse.data.posts);
                    setSavedPosts(savedPostResponse.data.savedPosts);
                    setLoading(false);
                } catch (error) {
                    console.log('Error fetching posts:', error);
                    setLoading(false);
                }
            };
            fetchPosts();
        }
    }, [profileUser._id]);

    useEffect(() => {
        // Retrieve the saved tab index from local storage
        const savedTabIndex = localStorage.getItem('selectedTabIndex');
        if (savedTabIndex !== null) {
            setValue(Number(savedTabIndex));
        }
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        // Save the selected tab index to local storage
        localStorage.setItem('selectedTabIndex', newValue);
    };

    return (
        <Box sx={{ bgcolor: 'transparent', width: '100%', border: 'none' }}>
            <AppBar position="static" sx={{ boxShadow: 'none', border: 'none', backgroundColor: 'transparent' }}>
                <Tabs className='bor' style={{ border: 'none' }}
                    value={value}
                    onChange={handleChange}
                    indicatorColor="secondary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                >
                    <Tab icon={<AppsIcon />} iconPosition="start" label="POSTS" sx={{ fontSize: '12px' }} />
                    {CurrUser._id === profileUser._id ? (
                        <Tab icon={<BookmarkIcon />} iconPosition="start" label="SAVED" sx={{ fontSize: '12px' }} />
                    ) : (
                        <Tab icon={<NotStartedIcon />} iconPosition="start" label="REELS" sx={{ fontSize: '12px' }} />
                    )}
                    <Tab icon={<PersonPinIcon />} iconPosition="start" label="TAGGED" sx={{ fontSize: '12px' }} />
                </Tabs>
            </AppBar>

            {loading ? (
                <PostGridSkeleton />
            ) : (
                <>
                    <TabPanel value={value} index={0} dir={theme.direction}>
                        <ProfilePostGreed posts={posts} />
                    </TabPanel>
                    {CurrUser._id === profileUser._id ? (
                        <TabPanel value={value} index={1} dir={theme.direction}>
                            <SavedPostGrid posts={savedPosts} />
                        </TabPanel>
                    ) : (
                        <TabPanel value={value} index={1} dir={theme.direction}>
                            reels here
                        </TabPanel>
                    )}
                    <TabPanel value={value} index={2} dir={theme.direction}>
                        <TaggUserPostGrid posts={taggPosts} />
                    </TabPanel>
                </>
            )}
        </Box>
    );
}

