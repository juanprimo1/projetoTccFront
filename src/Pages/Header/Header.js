import "./header.css"

export default function Header(props) {
    return(
        <header>
            <div className="title">
                <span>Pizza</span>
            </div>

            <div className="title">
                <span>{props.name} 👤</span>
            </div>
        </header>
    );
}