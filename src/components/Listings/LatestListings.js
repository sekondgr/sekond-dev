// components/LatestListings.js

import React, { useState, useEffect } from 'react';
import sdk from '../../util/sdkUtil';
import ListingCard from '../ListingCard/ListingCard';

import styles from './LatestListings.module.css';

const LatestListings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        sdk.listings.query({
            perPage: 20,
            include: 'images',
        })
            .then(res => {
                const { data, included } = res.data;
                const images = included.filter(item => item.type === 'image');

                const listingsWithImages = data.map(listing => {
                    // Map the image ids to actual image objects
                    const listingImages = listing.relationships.images.data.map(imgRel =>
                        images.find(img => img.id.uuid === imgRel.id.uuid)
                    );

                    return { ...listing, images: listingImages };
                });

                setListings(listingsWithImages);
                setLoading(false);
            })
            .catch(e => {
                setError(e);
                setLoading(false);
            });
    }, []);


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading listings</div>;

    return (
        <div>
            <h2 className={styles.latestListingsHeader}>shop the latest</h2>
            <div className={styles.latestListingsContainer}>
                {listings.map(listing => (
                    console.log(listing),
                    <ListingCard key={listing.id.uuid} listing={listing} />
                ))}
            </div>
        </div>
    );
};

export default LatestListings;
