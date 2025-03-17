import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { AppBar, Tabs, Tab, Box, } from '@mui/material';
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

    const isProfileOwner = CurrUser._id === profileUser._id;

    const tabs = [
        { label: "POSTS", icon: <AppsIcon /> },
        ...(isProfileOwner ? [{ label: "SAVED", icon: <BookmarkIcon /> }] : []),
        { label: "TAGGED", icon: <PersonPinIcon /> }
    ];

    // Fetch saved posts
    useEffect(() => {
        if (isProfileOwner) {
            const fetchSavedPosts = async () => {
                try {
                    const savedPostResponse = await axiosInstance.get(`/api/savedPost/saved-posts`);
                    setSavedPosts(savedPostResponse.data.savedPosts);
                } catch (error) {
                    console.log('Error fetching saved posts:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchSavedPosts();
        }
    }, [isProfileOwner]);

    // Fetch tagged posts
    useEffect(() => {
        if (profileUser._id) {
            const fetchTagPosts = async () => {
                try {
                    const taggPostsResponse = await axiosInstance.get(`/api/post/tagged/${profileUser._id}`);
                    setTaggPosts(taggPostsResponse.data.posts);
                } catch (error) {
                    console.log('Error fetching Tagged posts:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchTagPosts();
        }
    }, [profileUser._id]);

    // Retrieve active tab index from localStorage
    useEffect(() => {
        const savedTabIndex = localStorage.getItem('selectedTabIndex');

        // Ensure it's a valid number; default to 0 if not
        if (savedTabIndex !== null && !isNaN(savedTabIndex)) {
            const tabIndex = Number(savedTabIndex);

            // Ensure value is within valid range
            if (CurrUser._id === profileUser._id) {
                setValue(tabIndex > 2 ? 0 : tabIndex); // Reset to 0 if invalid
            } else {
                setValue(tabIndex > 1 ? 0 : tabIndex); // Reset to 0 if invalid
            }
        } else {
            setValue(0);  // Default to the first tab
        }
    }, [profileUser]);  // Reset when `profileUser` changes    

    // Save active tab index to localStorage
    const handleChange = (event, newValue) => {
        setValue(newValue);
        localStorage.setItem('selectedTabIndex', newValue);
    };

    return (
        <Box sx={{ bgcolor: 'transparent', width: '100%' }}>
            <AppBar position="static" sx={{ boxShadow: 'none', backgroundColor: 'transparent' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="secondary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    {tabs.map((tab, index) => (
                        <Tab key={index} icon={tab.icon} iconPosition="start" label={tab.label} sx={{ fontSize: '12px' }} />
                    ))}
                </Tabs>
            </AppBar>

            {loading ? (
                <PostGridSkeleton />
            ) : (
                <>
                    <TabPanel value={value} index={0} dir={theme.direction}>
                        <PostsGrid posts={posts} message={'no posts yet'} type={'profile'} />
                    </TabPanel>

                    {isProfileOwner && (
                        <TabPanel value={value} index={1} dir={theme.direction}>
                            <PostsGrid posts={savedPosts} message={'no posts saved yet'} type={'saved'} />
                        </TabPanel>
                    )}

                    <TabPanel value={value} index={isProfileOwner ? 2 : 1} dir={theme.direction}>
                        <PostsGrid posts={taggPosts} message={"no tagged's yet"} type={'taged'} />
                    </TabPanel>
                </>
            )}
        </Box>
    );
}
