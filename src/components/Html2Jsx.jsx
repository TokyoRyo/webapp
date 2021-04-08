import React from 'react';
import parse from 'html-react-parser';

class Html2Jsx extends React.Component{
    constructor(props) {
        super(props)
    }
    render(){
        const jsx = parse(this.props.html)
        return(
            <div>{jsx}</div>
        )
    }
}

export default Html2Jsx;
