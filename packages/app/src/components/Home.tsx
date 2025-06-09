import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Link,
  Typography,
} from '@mui/material';

const cardTextStyle = {
  position: 'absolute',
  paddingLeft: '0.8rem',
  paddingTop: '5rem',
  bottom: '0.5rem',
  width: '100%',
  boxShadow: 'inset 0 -230px 70px -120px #fff',
};

const cardStyle = {
  boxShadow: 4,
  borderRadius: '8px',
  width: '100%',
  height: '100%',
};

export const Home = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100% - 54px)',
        width: '100%',
        paddingBottom: '50px',
      }}
    >
      <Card raised sx={{ maxWidth: 1400, borderRadius: '10px', boxShadow: 'none' }}>
        <CardContent>
          <Typography gutterBottom variant="h4" component="div">
            Welcome to UpSet 2.0
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You haven't loaded data, you can't access the workspace you are attemping to
            view, or you are not logged in. To log in, click the account icon in the top
            right corner. To load stored data or upload new data, visit{' '}
            <Link
              href="https://multinet.app"
              aria-label="Multinet homepage"
              color="secondary.dark"
            >
              multinet.app
            </Link>
            .
          </Typography>
          <Typography variant="h5" color="text.primary" sx={{ marginTop: '1rem' }}>
            Examples
          </Typography>
          <Typography variant="body1" color="text.secondary">
            If this is your first time visiting UpSet, click on the images below to
            explore some examples.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              marginTop: '1em',
              marginBottom: '1em',
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: '280px 280px',
                gridColumnGap: '20px',
                gridRowGap: '20px',
                width: '60%',
                height: '100%',
                margin: 'auto',
                marginTop: '1em',
              }}
            >
              <Card sx={cardStyle} aria-label="Example of a dataset of movies in UpSet">
                <CardActionArea
                  onClick={() =>
                    window.open('/?workspace=Upset+Examples&table=movies&sessionId=2939')
                  }
                >
                  <CardMedia
                    component="img"
                    sx={{ height: '250px', paddingTop: '4px' }}
                    image="/placard/movies_example.png"
                    alt="Example UpSet plot: movies"
                  />
                  <CardContent sx={{ paddingLeft: 0 }}>
                    <Typography variant="h5" component="div" sx={cardTextStyle}>
                      Movies - Upset
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              <Card
                sx={cardStyle}
                aria-label="Example of a dataset of Covid Symptoms in UpSet"
              >
                <CardActionArea
                  onClick={() =>
                    window.open(
                      '/?workspace=Upset+Examples&table=Covid_Symptoms&sessionId=2938',
                    )
                  }
                >
                  <CardMedia
                    component="img"
                    sx={{ height: '250px', paddingTop: '4px' }}
                    image="/placard/covid_example.png"
                    alt="Example UpSet plot: Covid Symptoms"
                  />
                  <CardContent sx={{ paddingLeft: 0 }}>
                    <Typography variant="h5" component="div" sx={cardTextStyle}>
                      Covid Symptoms - Upset
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              <Card
                sx={cardStyle}
                aria-label="Example of a dataset of Tennis Grandslam Championships in UpSet"
              >
                <CardActionArea
                  onClick={() =>
                    window.open(
                      '/?workspace=Upset+Examples&table=Tennis_Grand_Slam_Champions&sessionId=2937',
                    )
                  }
                >
                  <CardMedia
                    component="img"
                    sx={{ height: '250px', paddingTop: '4px' }}
                    image="/placard/tennis_example.png"
                    alt="Example UpSet plot: Tennis Grand Slam Championships"
                  />
                  <CardContent sx={{ paddingLeft: 0 }}>
                    <Typography variant="h5" component="div" sx={cardTextStyle}>
                      Tennis Tournament Winners - Upset
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              <Card
                sx={cardStyle}
                aria-label="Example of a dataset of World Organizations in UpSet"
              >
                <CardActionArea
                  onClick={() =>
                    window.open(
                      '/?workspace=Upset+Examples&table=International_Organizations&sessionId=2936',
                    )
                  }
                >
                  <CardMedia
                    component="img"
                    sx={{ height: '250px', paddingTop: '4px' }}
                    image="/placard/world_orgs_example.png"
                    alt="Example UpSet plot: World Organizations"
                  />
                  <CardContent sx={{ paddingLeft: 0 }}>
                    <Typography variant="h5" component="div" sx={cardTextStyle}>
                      World Organizations - UpSet
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
