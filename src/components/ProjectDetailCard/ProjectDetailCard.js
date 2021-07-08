import React, { useState } from "react";
import "./ProjectDetailCard.css";
import { useDataLayerValues } from "../../datalayer";
import share_logo from "./../../assets/share.svg";
import FavoriteIcon from '@material-ui/icons/Favorite';
import Rating from '@material-ui/lab/Rating';
import ShareProject from "../ShareProject/ShareProject";
import { AddLike, AddNewRating } from "./../../axios/instance";
import { toast } from "react-toastify";

import { getSkillColor } from "../../utils";

function ProjectDetailCard()
{
  const [{ ProjectDetails, isAuthenticated }, dispatch] = useDataLayerValues();
  const [shareopen, setshareopen] = useState(false);
  const [likescount,setLikesCount] = useState(ProjectDetails.likes);
  const [liked,setLiked] = useState(false);
  const [rated,setRated] = useState(false);
  const [ratinggiven, setRatingGiven] = useState(ProjectDetails.rating);

  const LikeBtnHandler = async () => {
    if (!isAuthenticated) {
      return toast.error(`You have to login first`);
    }
    
    if(!liked) {
      setLiked(true);setLikesCount(likescount + 1);

      try {
        const data = {
          project_id: ProjectDetails.id,
          likes: likescount + 1,
        };

        const res = await AddLike(data);
        if(!res.data.error)
        {
          const projectdata = {
            ...ProjectDetails,
            likes:likescount + 1,
          };
          dispatch({
            type: "SET_PROJECT_DETAILS",
            ProjectDetails: projectdata,
          });
          toast.success(`${res.data.msg}`);
        }
      } catch (err) {
        if (err.response) {
          toast.error(`${err.response.data.error}`);
        }
      }
    }
  };

  const shareButtonHandler = () =>
  {
    setshareopen(!shareopen);
  };

  const newRatingHandler = async (event, ratingval) => {

    if (!isAuthenticated) {
      return toast.error(`You have to login first`);
    }

    if(!rated)
    {
      setRated(true);
      setRatingGiven(ratingval);

      try {
        const data = {
          project_id: ProjectDetails.id,
          newrating: ratingval,
        };

        const res = await AddNewRating(data);
        if(!res.data.error)
        {
          const projectdata = {
            ...ProjectDetails,
            rating:res.data.data,
          };
          dispatch({
            type: "SET_PROJECT_DETAILS",
            ProjectDetails: projectdata,
          });
          toast.success(`${res.data.msg}`);
        }
      } catch (err) {
        if (err.response) {
          toast.error(`${err.response.data.error}`);
        }
      }
    }   
  }

  return (
    <div className="details_card">
      <div className="titleBox">
        <h1 className="title_">{ProjectDetails.title}</h1>
        <div className="like-share">
          <img
          src={share_logo}
          className='share-icon'
          alt='share-logo'
          onClick={shareButtonHandler}
         />
        </div>
      </div>
      {shareopen ? <ShareProject title={ProjectDetails.title} description={ProjectDetails.descr} /> : null}
      <h4 className="level_">{ProjectDetails.level} Level</h4>
      <p className="desc_">
        {ProjectDetails.descr}
      </p>
      <div className="card-footer_">
        <div className="skills_">
          {ProjectDetails.skills &&
            ProjectDetails.skills.map((skill, ind) => (
              <div key={ind} style={{ backgroundColor: getSkillColor(skill) }} className="skill">
                {skill}
              </div>
            ))}
        </div>
        <div className="rating_div">
            <h4 className="like_label_">Give it a Like </h4>
            <div className="like-share">
              <FavoriteIcon className={(!liked) ? 'heart' : 'liked-heart'} onClick={LikeBtnHandler}></FavoriteIcon>
                {" "}
               <span className={(!liked) ?  '' :'liked-heart'}>{likescount}</span>
            </div>
        </div>
        <div className="rating_div">
            <h4 className="rate_label_">Rate Project </h4>
            <Rating
              name="rating"
              size="large"
              precision={0.5}
              defaultValue={ratinggiven}
              value={ratinggiven}
              onChange={newRatingHandler}
            />
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailCard;
