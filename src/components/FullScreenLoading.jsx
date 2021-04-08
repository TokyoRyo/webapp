import React from 'react';

class FullScreenLoading extends React.Component {
    render() {
        return(
            <div className="app_fullscreen">
                <div className="spinner-border text-primary app_fullscreen__center" role="status">
                    <span className="visually-hidden"></span>
                </div>
            </div>
            
        );
    };
    
}

export default FullScreenLoading;
