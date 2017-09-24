import React from 'react';
import {Link, hashHistory, browserHistory} from 'react-router';
import {Authorizer, isAuthorized} from "../utilities/authorizer.jsx";
import Fetcher from '../utilities/fetcher.jsx';
import Load from '../utilities/load.jsx';
import Jumbotron from "../layouts/jumbotron.jsx";
import Content from "../layouts/content.jsx";
import ContentTitle from "../layouts/content-title.jsx";
import DataTable from "../elements/datatable/datatable.jsx";
import DateFormat from "../utilities/date-format.jsx";
import {DashboardWidgets} from "../elements/dashboard/dashboard-widgets.jsx";
import {ServiceOverTimeChart, ServiceStatusChart} from "../elements/dashboard/dashboard-chart.jsx";
import DashboardRequestedServices from "./dashboard-requested-services.jsx";
import DashboardCancellationRequests from "./dashboard-cancellation-requests.jsx";
import PageSection from "../layouts/page-section.jsx";

class Dashboard extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            loading: true,
            analytics: {}
        };

        this.fetchAnalytics = this.fetchAnalytics.bind(this);
    }

    componentDidMount(){
        if(!isAuthorized({permissions:["can_administrate", "can_manage"]})){
            return browserHistory.push("/login");
        }else{
            this.fetchAnalytics();
        }
    }

    fetchAnalytics(){
        let self = this;
        Fetcher('/api/v1/analytics/data').then(function (response) {
            self.setState({loading: false, analytics: response});
        })
    }

    render () {
        let pageName = this.props.route.name;

        if(this.state.loading){
            return(
                <div className="page-service-instance">
                    <Jumbotron pageName={pageName} location={this.props.location}/>
                    <Content>
                        <div className="row">
                            <Load/>
                        </div>
                    </Content>
                </div>
            );
        }else{
            return(
                <Authorizer permissions={["can_administrate", "can_manage"]}>
                    <Jumbotron pageName={pageName} location={this.props.location}/>
                    <div className="page-service-instance">
                        <Content>
                            <div>
                                <ContentTitle title="Welcome to your dashboard"/>
                                <DashboardWidgets data={this.state.analytics}/>
                                <div className="row">
                                    <div className="col-md-8 dashboard-charts">
                                        <DashboardRequestedServices/>
                                        <DashboardCancellationRequests/>
                                    </div>
                                    <div className="col-md-4">
                                        <ServiceStatusChart className="dashboard-charts"/>
                                        <ServiceOverTimeChart className="dashboard-charts"/>
                                    </div>
                                </div>
                            </div>
                        </Content>
                    </div>
                </Authorizer>
            );
        }
    }
}

export default Dashboard;
