var PropTypes = window.React.PropTypes;
var React = window.React;

var styles = {
    thumbnail: {
        maxWidth: '242px',
        textAlign: 'center',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    image: { width: '100%', height: '200px', display: 'block' }
};

var ProductCardComponent = React.createClass( {
    render: function() {
        return (
            <div className="col-sm-6 col-md-4">
                <div className="thumbnail" style={styles.thumbnail}>
                    <img src={this.props.image} style={styles.image} alt="..." />
                    <div className="caption">
                        <h3>{this.props.title}</h3>
                        <p>{this.props.description}</p>
                        <p>{this.props.price} Eur</p>
                        <p><button className="btn btn-primary" role="button">Details</button></p>
                    </div>
                </div>
            </div>
        );
    }
});

ProductCardComponent.propTypes = {
    id: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
};



var ProductAdministrationComponent = function( props ) {
    var title;
    if ( props.id ) {
        title = 'Atnaujinamas produktas ' + props.params.id;
    } else {
        title = 'Kuriamas naujas produktas';
    }
    return (
        <div>
            <h2>{title}</h2>
            <form>
                <div className="form-group">
                    <label>Title</label>
                    <input className="form-control" value={props.title} onChange={props.onTitleChange} />
                </div>
                <div className="form-group">
                    <label>Image url</label>
                    <input className="form-control" value={props.image} onChange={props.onImageChange} />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <input
                        className="form-control"
                        value={props.description}
                        onChange={props.onDescriptionChange}
                        />
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <input className="form-control" value={props.price} onChange={props.onPriceChange} />
                </div>
                <div className="form-group">
                    <label>Quantity</label>
                    <input
                        className="form-control"
                        value={props.quantity}
                        onChange={props.onQuantityChange}
                        />
                </div>

                <button className="btn btn-success" style={{ marginRight: '20px' }} onClick={props.onSaveClick}>Save</button>
            </form>
        </div>
    );
};
var ProductAdministrationContainer = React.createClass( {
    getInitialState: function() {
        return {
            image: '',
            title: '',
            description: '',
            price: 0,
            quantity: 0,
        };
    },

    handleSaveClick: function( e ) {
        var self = this;
        axios.post( 'https://itakademija.herokuapp.com/api/products' )
            .then( function( response ) {
                self.setState( { products: response.data });
            })
    },

    onTitleChange: function( e ) {
        this.setState( { title: e.target.value });
    },

    onImageChange: function( e ) {
        this.setState( { image: e.target.value });
    },

    onDescriptionChange: function( e ) {
        this.setState( { description: e.target.value });
    },

    onPriceChange: function( e ) {
        this.setState( { price: e.target.value });
    },

    onQuantityChange: function( e ) {
        this.setState( { quantity: e.target.value });
    },
    render: function() {
        return <ProductAdministrationComponent products={this.state.products} />
    }

});

var ProductListComponent = function( props ) {
    var productCards = props.products.map( function( product, index ) {
        return (
            <ProductCardComponent
                key={index}
                id={product.id}
                image={product.image}
                title={product.title}
                description={product.description}
                price={product.price}
                />
        );
    });
    return (
        <div className="row">
            {productCards}</div>
    );
};

var ProductListContainer = React.createClass( {
    getInitialState: function() {
        return { products: [] };
    },

    componentWillMount: function() {
        var self = this;
        axios.get( 'https://itakademija.herokuapp.com/api/products' )
            .then( function( response ) {
                self.setState( { products: response.data });
            })
    },

    render: function() {
        return <ProductListComponent products={this.state.products} />
    }
});
ProductListComponent.propTypes = {
    products: React.PropTypes.array.isRequired,
};



var App = function( props ) {
    return <div>{props.children}</div>;
};
var ProductListPage = function() {
    return <ProductListContainer />
}
var ProductAdministrationPage = function() {
    return <ProductAdministrationContainer />
}
var NoMatch = function( props ) {
    return <div>Route did not match</div>;
};

var SomePageComponent = function( props ) {
    var goRoot = function( e ) {
        props.router.push( "/" );
    }
    return (
        <div>
            At route: {props.router.getCurrentLocation().pathname}
            <button onClick={goRoot}>Go to Root route</button>
            <pre>
                {JSON.stringify( props, null, 2 )}
            </pre>
        </div>
    );
};

var Router = window.ReactRouter.Router;
var Route = window.ReactRouter.Route;
var IndexRoute = window.ReactRouter.IndexRoute;

ReactDOM.render((
    <Router history={window.ReactRouter.hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={ProductListPage} />
            <Route path="/products" component={ProductListPage} />
            <Route path="/admin/products/new" component={ProductAdministrationPage} />
            <Route path="/admin/products/:id" component={ProductAdministrationPage} />
            <Route path="*" component={NoMatch} />
        </Route>
    </Router>
), document.getElementById( 'root' ) );
