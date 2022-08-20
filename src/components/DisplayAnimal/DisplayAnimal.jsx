import React, {useLayoutEffect, useState, useRef} from "react";
import PropTypes from "prop-types";
import { Card, CardContent, CardMedia, CardActions, Typography, IconButton } from "@mui/material";
import PetsIcon from '@mui/icons-material/Pets';
import CancelIcon from '@mui/icons-material/Cancel';

const maxNum = 100;
const breedRegex = /\/breeds\/(.+)\//;
const imageSet = new Set();

export const DisplayAnimal = (props) => {
    const [animalImage, setAnimalImage] = useState();
    const [imagesSeen, setImagesSeen] = useState(1);
    const breedArr = useRef(new Array());

    const handleReaction = (reaction) => {
        if (imagesSeen < maxNum) {
            props.dispatch({type: reaction, photo: animalImage.photo, breed: animalImage.breed, subBreed: animalImage.subBreed});
            setImagesSeen(imagesSeen+1);
        }
    }

    useLayoutEffect(() => {
        const getAnimalImage = async () => {
            let resp;
            let info;
            let photoStatus = true;
            const randomChance = Math.random();
            while (photoStatus) {
                if (!animalImage || randomChance >= 0.5) {
                    resp = await fetch("https://dog.ceo/api/breeds/image/random");
                    info = await resp.json();
                }
                else {
                    const randomIndex = Math.floor(Math.random() * breedArr.current.length);
                    const randomBreed = breedArr.current[randomIndex];
                    resp = await fetch(`https://dog.ceo/api/breed/${randomBreed}/images/random`);
                    info = await resp.json();
                }
                if (!imageSet.has(info.message)) {
                    imageSet.add(info.message);
                    photoStatus = false;
                }
            }
            if (info.status === "success") {
                const breedMatch = breedRegex.exec(info.message);
                if (breedMatch) {
                    const breed = breedMatch?.[1];
                    const breedOrSubBreed = breed.split("-");
                    if (breedOrSubBreed.length > 1) {
                        breedArr.current.push(breedOrSubBreed[0]);
                        setAnimalImage({photo: info.message, breed: breedOrSubBreed[0], subBreed: breedOrSubBreed[1]})
                    }
                    else {
                        breedArr.current.push(breed);
                        setAnimalImage({photo: info.message, breed: breed, subBreed: ""});
                    }
                }
            }
        }
        getAnimalImage();
    }, [imagesSeen]);

    return (
        <>
            <Card sx = {{ maxWidth: 500, maxHeight: 700 }}>
                <CardMedia component = "img" height = "540" image = {animalImage ? animalImage.photo : null} >
                </CardMedia>
                <CardContent style={{backgroundColor: ""}}>
                    <Typography gutterBottom variant = "h5" component = "div">
                        {animalImage ? animalImage?.breed ? `${animalImage?.subBreed} ${animalImage.breed}` : "" : "" }
                    </Typography>
                    <CardActions>
                        <IconButton onClick = {(e) => handleReaction("disliked")} color = "error" sx={{ml: 5, mr: 25}}>
                            <CancelIcon 
                            style={{
                                minWidth: "60px",
                                minHeight: "60px"
                              }}/>
                        </IconButton>
                        <IconButton onClick = {(e) => handleReaction("liked")} color = "success">
                            <PetsIcon 
                            fontSize = "large"
                            style={{
                                minWidth: "60px",
                                minHeight: "60px"
                              }}/>
                        </IconButton>
                    </CardActions>
                </CardContent>
            </Card>
        </>
    );
}

DisplayAnimal.propTypes = {
    dispatch: PropTypes.func
};

export default DisplayAnimal;