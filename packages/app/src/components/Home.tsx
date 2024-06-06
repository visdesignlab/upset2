import { Box, Card, CardActionArea, CardContent, CardMedia, Link, Typography } from "@mui/material"

export const Home = () => {
    return (
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100% - 54px)', width: '100%', paddingBottom: "50px"}}>
            <Card raised sx={{ maxWidth: 1000, borderRadius: "10px" }}>
                <CardContent>
                    <Typography gutterBottom variant="h4" component="div">
                        Welcome to UpSet 2.0
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        You haven't loaded data, you can't access the workspace you are attemping to view, or you are not logged in. 
                        To log in, click the account icon in the top right corner.
                        To load stored data or upload new data, visit <Link href="https://multinet.app" aria-label="Navigate to Multinet homepage" color="secondary.dark">multinet.app</Link>.
                    </Typography>
                    <Typography variant="h5" color="text.primary" sx={{marginTop: "1rem"}}>
                        Examples
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        If this is your first time visiting UpSet, click on the images below to explore some examples.
                    </Typography>
                    <Box sx={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%', marginTop: '1em'}}>
                        <Card sx={{boxShadow: 4, borderRadius: "8px"}} aria-label="Example of a dataset of movies in UpSet">
                            <CardActionArea onClick={() => window.open('/?workspace=Upset+Examples&table=movies&sessionId=192')}>
                                <CardMedia component="img" height="250" image="/placard/movies.png" alt="Example UpSet plot: movies" />
                                <CardContent sx={{paddingLeft: 0}}>
                                    <Typography variant="h5" component="div" sx={{paddingLeft: "0.8rem", position: 'absolute', bottom: '0.5rem', width: '100%', paddingTop: '5rem', boxShadow: 'inset 0 -230px 70px -120px #fff'}}>
                                        Movies - Upset
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                        <Card sx={{boxShadow: 4, borderRadius: "8px"}} aria-label="Example of a dataset of Simpsons character attributes in UpSet">
                            <CardActionArea onClick={() => window.open('/?workspace=Upset+Examples&table=simpsons&sessionId=193')}>
                                <CardMedia component="img" height="250" image="/placard/simpsons.png" alt="Example UpSet plot: simpsons" />
                                <CardContent sx={{paddingLeft: 0}}>
                                    <Typography variant="h5" component="div" sx={{paddingLeft: "0.8rem", position: 'absolute', bottom: '0.5rem', width: '100%', paddingTop: '5em', boxShadow: 'inset 0 -230px 70px -120px #fff'}}>
                                        Simpsons - Upset
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}