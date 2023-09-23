function outputDelay(item) {
    let adv = new Date(item.AdvertisedTimeAtLocation);
    let est = new Date(item.EstimatedTimeAtLocation);

    const diff = Math.abs(est - adv);

    return Math.floor(diff / (1000 * 60)) + ' minuter'; //Överväg ta bort "minuter" kan läggas till fritt i html.
}

export default outputDelay;
