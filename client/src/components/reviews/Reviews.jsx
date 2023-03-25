import React, { useState, useEffect } from 'react';
import RatingBreakdown from './RatingBreakdown.jsx'
import ReviewList from './ReviewList.jsx'
import NewReview from './NewReview.jsx'
import { RatingCalculator } from '../relatedProducts/helperFunctions.jsx'
import axios from 'axios';

const Reviews = ({ updateSelectedProduct, productId, productName, updateAverageRating, averageStarRating, updateTotalNumberReviews, totalNumberReviews }) => {

  /*  This Component will need the below from it's parent:
        -) product_id, product name, product characteristics (latter two needed for NewReview)
      This Component will request the below from the API:
        -) Reviews from GET /reviews/
        -) Review Metadata from GET /reviews/meta
      This Component will store the following state:
        -) Reviews
        -) Reviews Metadata
      This Component will send the following state:
        -) Reviews TO ReviewList
        -) Reviews Metadata to RatingBreakdown
      This Component's state can be updated by the following components:
        -) SortOptions (can sort by dropdown)
        -) ReviewTile (can mark as helpful)
        -) **UNSURE RatingBreakdown (can filter for reviews with specific ratings, additive)
        -) KeywordSearch
    Note: Will need to make functions for subsequent calls to getReviews API to filter & sort the results
  */
     // //array of review objects


  const [reviews, setReviews] = useState([])
  const [filteredReviews, setFilteredReviews] = useState([])
  const [reviewsMeta, setReviewsMeta] = useState(null)
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('relevant')
  //Could refactor to get reviews count first.
  const [count, setCount] = useState(1000000)
  const [filters, setFilters] = useState([]);

  const getReviews = (currentCount, currentPage, currentSort) => {
    return axios.get('/reviews', {
      params: {
        product_id: productId,
        count: currentCount,
        page: currentPage,
        sort: currentSort
      }
    })
  }

  const getReviewsMeta = () => {
    axios.get('/reviews/meta', {
      params: {
        product_id: productId
      }
    })
    .then((result) => {
      setReviewsMeta(result.data);
      var averageRating = RatingCalculator(result.data.ratings)
      updateAverageRating(averageRating)
    })
    .catch((err) => {console.log('Trouble getting reviews meta from client', err)});
  }

  const updateReviews = () => {
    getReviews(count, page, sort)
    .then((result) => {
      if (result.data.results.length === 0) {
        updateAverageRating(0)
      }
      setReviews(result.data.results);
    })
    .catch((err) => {console.log('Trouble getting reviews from client', err)});
  }


  const sortReviews = (e) => {
    e.preventDefault();
    var newSort = e.target.value.toLowerCase()
    setSort(newSort)

  }

  const updateFilters = (e, stars) => {
    e.preventDefault();
    if (!filters.includes(stars)){
      setFilters([...filters, stars]);
    } else {
        var newFilters = filters.filter((currentFilter)=>{
          return currentFilter !== stars
        });
        setFilters(newFilters);
      }
  }

  const filterReviews = () => {
    var filteredReviews = reviews.filter((review)=> {
      return filters.includes(review.rating);
    });

    if (filters.length !== 0) {
      setFilteredReviews(filteredReviews);
    } else {
      setFilteredReviews(reviews);
    }
    console.log('WHat are the reviews', filteredReviews)
  }

  useEffect(() => {
    updateReviews()
    getReviewsMeta()
  }, [])

  useEffect(() => {
    updateReviews()
    getReviewsMeta()
  }, [productId])


  useEffect(() => {
    updateReviews()
    filterReviews()
  }, [sort])

  useEffect(() => {
    filterReviews()
  }, [filters])

  useEffect(() => {
    filterReviews()
  }, [reviews])



  return (
    <div data-testid='reviews-1' style={{border: '2px solid red'}}>
      <div className="reviews reviewsMain">
        { reviewsMeta!== null && reviews.length !== 0 ? <RatingBreakdown reviewsMeta={reviewsMeta} updateFilters={updateFilters} totalNumberReviews={totalNumberReviews} updateTotalNumberReviews={updateTotalNumberReviews} averageStarRating={averageStarRating}/> : null }
        { reviews.length !== 0 ? <ReviewList reviews={filteredReviews}  sortReviews={sortReviews} updateReviews={updateReviews} reviewsMeta={reviewsMeta}/> : 'There are no reviews!'}
      </div>
    </div>
  )
}

export default Reviews;