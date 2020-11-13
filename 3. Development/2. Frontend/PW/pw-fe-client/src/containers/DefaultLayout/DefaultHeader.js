import React, {Component} from 'react';
import cls from "./header.module.less";
import RightContent from "../../components/GlobalHeader/RightContent";
import {Layout} from "antd";
import {connect} from "react-redux";
import {SiteActions, AuthActions, NewsActions} from "../../redux/actions";

const {Header} = Layout;
// const {Option} = Select;

class DefaultHeader extends Component {

    state = {
        siteId: localStorage.siteId,
    };

    componentDidMount() {
        this.props.fetchAllSitesNoPaging();
        this.props.fetchUserInfo();
        this.props.fetchTopNews();
        this.props.fetchBalance();
    }

    // handleChange = (value) => {
    //     this.setState({
    //         siteId: value
    //     }, () => {
    //         localStorage.setItem('siteId', value);
    //     })
    //     //  window.location.reload();
    // };


    componentWillReceiveProps(nextProps) {
        const {listSitesNoPaging} = this.props;
        if (nextProps.listSitesNoPaging && nextProps.listSitesNoPaging.sites && nextProps.listSitesNoPaging.sites[0] && nextProps.listSitesNoPaging.sites !== listSitesNoPaging.sites) {
            if (!localStorage.siteId) {
                this.setState({
                    siteId: nextProps.listSitesNoPaging.sites[0].id,
                });
                localStorage.setItem('siteId', nextProps.listSitesNoPaging.sites[0].id);
            }
        }
    }


    render() {

        const {listTopNews} = this.props;

        // console.log(listSitesNoPaging.sites && listSitesNoPaging.sites[0] && listSitesNoPaging.sites[0].id);

        return (
            <Header className={cls.header}>
                {/*<div className={cls.left}>*/}
                {/*    <Select*/}
                {/*        value={this.state.siteId}*/}
                {/*        style={{width: 200}}*/}
                {/*        onChange={this.handleChange}*/}
                {/*        placeholder='Select site'*/}
                {/*    >*/}
                {/*        {*/}
                {/*            listSitesNoPaging.sites.map(site => (*/}
                {/*                <Option key={site.id} value={site.id}>{site.title}</Option>*/}
                {/*            ))*/}
                {/*        }*/}
                {/*    </Select>*/}
                {/*</div>*/}
                <RightContent
                    history={this.props.history}
                    signOut={this.props.signOut}
                    userInfo={this.props.userInfo}
                    listTopNews={listTopNews}
                    balance={this.props.balance}
                />
            </Header>
        );
    }
}

const mapStateToProps = (state) => ({
    listSitesNoPaging: state.toJS().sites.listSitesNoPaging,
    userInfo: state.toJS().auth.userInfo.data,
    listTopNews: state.toJS().news.listTopNews,
    balance: state.toJS().auth.balance.data,
});

const mapDispatchToProps = (dispatch) => ({
    fetchAllSitesNoPaging: () => dispatch(SiteActions.fetchAllSitesNoPaging()),
    fetchUserInfo: () => dispatch(AuthActions.fetchUserInfo()),
    fetchTopNews: () => dispatch(NewsActions.fetchTopNews()),
    fetchBalance: () => dispatch(AuthActions.fetchBalance()),

});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(DefaultHeader);
