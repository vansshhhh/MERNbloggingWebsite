const LoadMoreDataBtn = ({ state, fetchDataFunc, additionalParam }) => {
    if (state != null && state.totalDocs && state.results && state.totalDocs > state.results.length) {
        return (
            <button
                className="flex items-center gap-2 p-2 px-3 rounded-md text-dark-grey hover:bg-grey/30"
                onClick={() => fetchDataFunc({...additionalParam, page: state.page + 1 })}
            >
                Load more
            </button>
        );
    }

    // return null; // Return null if the conditions are not met
};

export default LoadMoreDataBtn;
