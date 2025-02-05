import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useState, useEffect } from 'react';
import Slider from "react-slick";
import { Avatar, Box, Typography } from '@mui/material';
import axiosInstance from '../../AxiosInstance.jsx';
import { Link } from "react-router-dom";
import StoryListSkeleton from "../Skeletons/StoryListSkeleton";

export default function StoryList() {
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStoryList = async () => {
            try {
                const response = await axiosInstance.get('/api/story/get-stories-list');
                // console.log(response.data);
                setUserList(response.data.usersWithStories);
                setLoading(false);
            } catch (error) {
                console.log('error fetching story-list', error);
                setLoading(false);
            }
        }
        fetchStoryList();
    }, []);

    // react-slick settings
    const settings = {
        dots: false, // Disable dots for a cleaner look
        infinite: false, // Avoid looping back after last story
        speed: 500,
        slidesToShow: 5, // Number of avatars visible at a time
        slidesToScroll: 1, // Scroll one avatar at a time
        swipeToSlide: true, // Swipe behavior between slides
        responsive: [
            {
                breakpoint: 768, // For tablet or mobile view
                settings: {
                    slidesToShow: 1, // Show fewer avatars
                }
            },
            {
                breakpoint: 480, // For smaller mobile screens
                settings: {
                    slidesToShow: 4, // Show even fewer avatars
                }
            }
        ]
    };

    if (loading) {
        return (
            <StoryListSkeleton />
        );
    }

    return (
        <Box sx={{ margin: '0 auto', padding: '10px', minHeight: '100px', width: '85%' }}>
            <style>
                {`
                .slick-prev:before, .slick-next:before {
                    color: black;  /* Change arrow color */
                    font-size: 27px; /* Adjust size */
                }
                `}
            </style>
            {userList.length === 0 ? (
                <p>No stories available</p>
            ) : (
                <Slider {...settings}>
                    {userList.map(story => (
                        <div key={story._id} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            width: '100px',
                        }}>
                            <Box sx={{ width: '90%', m: '0 auto', display: 'flex' }}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        display: 'inline-block',
                                        borderRadius: '50%', // Circular shape for the border container
                                        width: { xs: '55px', md: '75px' }, // Slightly larger than the Avatar to show the border
                                        height: { xs: '55px', md: '75px' },
                                        background: 'linear-gradient(45deg, blue, red, yellow)',
                                        padding: '5px', // Space for the border thickness
                                        margin: '0 auto',
                                    }}
                                >
                                    <Avatar
                                        component={Link}
                                        to={`/story/${story.username}`}
                                        src={story.image.url}
                                        alt={story.username}
                                        sx={{
                                            width: { xs: '45px', md: '65px' },
                                            height: { xs: '45px', md: '65px' },
                                            margin: '0 auto',
                                            // border: '4px solid #1976d2',
                                        }}
                                    />
                                </Box>
                            </Box>

                            <Typography sx={{ maxWidth: '90%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'center', fontSize: '0.9rem', m: 'auto', marginTop: '8px' }} variant="body2" color="textSecondary">
                                {story.username}
                            </Typography>
                        </div>
                    ))}
                </Slider>
            )}

        </Box>
    );

};
