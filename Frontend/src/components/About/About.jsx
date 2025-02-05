import React from "react";
import { Container, Typography, Grid, Card, CardContent, IconButton, Stack } from "@mui/material";
import { LinkedIn, GitHub, Instagram, X } from "@mui/icons-material";

export default function About() {
    return (
        <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
            <Typography variant="h3" align="center" gutterBottom>
                About Our Social Media Platform
            </Typography>
            <Typography variant="body1" align="center" paragraph>
                Welcome to our innovative social media platform, where users can connect, share, and engage in real-time. Built using the MERN stack, our platform ensures seamless interactions, robust performance, and a secure experience.
            </Typography>

            {/* Features Section */}
            <Typography variant="h4" align="center" gutterBottom sx={{ mt: 4 }}>
                Key Features
            </Typography>
            <Grid container spacing={3} justifyContent="center">
                {[
                    { title: "Real-Time Messaging", desc: "Chat with friends instantly using Socket.io-powered messaging, with end-to-end Encryption." },
                    { title: "Post & Share", desc: "Create posts, like, comment, and share engaging content." },
                    { title: "Explore Page", desc: "Discover trending posts and new connections." },
                    { title: "Secure Authentication", desc: "Protected by Passport for a safe login experience." },
                ].map((feature, index) => (
                    <Grid item xs={12} sm={6} md={6} key={index}>
                        <Card sx={{ height: "100%", boxShadow: 3 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body2">{feature.desc}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Technologies Used Section */}
            <Typography variant="h4" align="center" gutterBottom sx={{ mt: 5 }}>
                Technologies Used
            </Typography>
            <Typography variant="body1" align="center" paragraph>
                Our platform is built using a modern tech stack to ensure scalability, security, and real-time performance. The key technologies used include:
            </Typography>
            <Grid container spacing={3} justifyContent="center">
                {[
                    { title: "Node.js & Express.js", desc: "Handles the backend logic and API routes efficiently." },
                    { title: "MongoDB", desc: "A NoSQL database ensuring high performance and scalability." },
                    { title: "React.js", desc: "Provides a seamless and interactive user experience." },
                    { title: "Socket.io", desc: "Enables real-time messaging and live updates." },
                    { title: "Redis", desc: "Used for caching to improve performance and reduce database load." },
                    { title: "Passport", desc: "Ensures secure authentication and authorization." },
                ].map((tech, index) => (
                    <Grid item xs={12} sm={6} md={6} key={index}>
                        <Card sx={{ height: "100%", boxShadow: 3 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {tech.title}
                                </Typography>
                                <Typography variant="body2">{tech.desc}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Team Section */}
            <Typography variant="h4" align="center" gutterBottom sx={{ mt: 5 }}>
                About the Developer
            </Typography>
            <Card sx={{ maxWidth: "80vw", mx: "auto", boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h5" align="center" gutterBottom>
                        Nikhil Sirsat
                    </Typography>
                    <Typography variant="body1" align="center">
                        Hi, I'm <strong>Nikhil Sirsat</strong>, A passionate and forward-thinking MERN stack developer dedicated to crafting high-performance, scalable, and intuitive applications. With a deep interest in cutting-edge web technologies and real-time applications. My focus lies in enhancing user experience, and implementing efficient backend solutions. I am always exploring new advancements in full-stack development, cloud computing, and scalable infrastructures to create robust digital ecosystems that empower users and businesses alike.
                    </Typography>
                </CardContent>
            </Card>
            {/* Get in Touch Section */}
            <Typography variant="h4" align="center" gutterBottom sx={{ mt: 5 }}>
                Get in Touch
            </Typography>
            <Typography variant="body1" align="center" paragraph>
                If you have any questions, feedback, or suggestions, feel free to reach out to me. You can connect with me on
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
                <IconButton component="a" href="https://www.linkedin.com/in/nikhil-sirsat-b49bb128a/" target="_blank" sx={{ color: '#0073e6' }}>
                    <LinkedIn fontSize="large" />
                </IconButton>
                <IconButton component="a" href="https://github.com/theAppleceo" target="_blank">
                    <GitHub fontSize="large" />
                </IconButton>
                <IconButton component="a" href="https://x.com/NikhilS27949297" target="_blank">
                    <X fontSize="large" />
                </IconButton>
            </Stack>
        </Container>
    );
};
