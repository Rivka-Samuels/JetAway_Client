import "./PageNotFound.css";

function PageNotFound(): JSX.Element {
    return (
        <div className="PageNotFound">
            <a href="/">
                <img src="https://rivkabucket.s3.amazonaws.com/JetAway/404.jpg" alt="Page Not Found" className="PageNotFound-image" />
            </a>
        </div>
    );
}

export default PageNotFound;
