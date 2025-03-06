
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { AppBar, Tabs, Tab, Box } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AppsIcon from '@mui/icons-material/Apps';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import axiosInstance from '../../AxiosInstance.jsx';
import PostGridSkeleton from '../Skeletons/PostGridSkeleton.jsx';
import PostsGrid from './PostsGrid.jsx';
import NotStartedIcon from '@mui/icons-material/NotStarted';

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

    // fetch saved posts
    useEffect(() => {
        if (profileUser && profileUser._id) {
            const fetchSavedPosts = async () => {
                try {
                    const savedPostResponse = await axiosInstance.get(`/api/savedPost/saved-posts`);
                    setSavedPosts(savedPostResponse.data.savedPosts);
                    setLoading(false);
                } catch (error) {
                    console.log('Error fetching saved posts:', error);
                    setLoading(false);
                }
            };
            fetchSavedPosts();
        }
    }, [profileUser._id]);

    // fetch tagged posts
    useEffect(() => {
        if (profileUser && profileUser._id) {
            const fetchTagPosts = async () => {
                try {
                    const taggPostsResponse = await axiosInstance.get(`/api/post/tagged/${profileUser._id}`);
                    setTaggPosts(taggPostsResponse.data.posts);
                    setLoading(false);
                } catch (error) {
                    console.log('Error fetching Tagged posts:', error);
                    setLoading(false);
                }
            };
            fetchTagPosts();
        }
    }, [profileUser._id]);

    // get active tab from local-storage
    useEffect(() => {
        const savedTabIndex = localStorage.getItem('selectedTabIndex');

        // Ensure it's a valid number; default to 0 if not
        if (savedTabIndex !== null && !isNaN(savedTabIndex)) {
            setValue(Number(savedTabIndex));
        } else {
            setValue(0);  // Default to the first tab
        }
    }, []);

    // save active tab index into the local-storage
    const handleChange = (event, newValue) => {
        setValue(newValue);
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
                        // null
                    )}
                    <Tab icon={<PersonPinIcon />} iconPosition="start" label="TAGGED" sx={{ fontSize: '12px' }} />
                </Tabs>
            </AppBar>

            {loading ? (
                <PostGridSkeleton />
            ) : (
                <>
                    <TabPanel value={value} index={0} dir={theme.direction}>
                        <PostsGrid posts={posts} message={'no posts yet'} type={'profile'} />
                    </TabPanel>
                    {CurrUser._id === profileUser._id ? (
                        <TabPanel value={value} index={1} dir={theme.direction}>
                            <PostsGrid posts={savedPosts} message={'no posts saved yet'} type={'saved'} />
                        </TabPanel>
                    ) : (
                        <TabPanel value={value} index={1} dir={theme.direction}>
                            reels here
                        </TabPanel>
                    )}
                    <TabPanel value={value} index={2} dir={theme.direction}>
                        <PostsGrid posts={taggPosts} message={"no tagged's yet"} type={'taged'} />
                    </TabPanel>
                </>
            )}
        </Box>
    );
}
