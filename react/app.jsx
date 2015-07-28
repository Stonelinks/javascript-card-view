/**
 * Created by ld on 7/24/15.
 */

var JobModel = function(data) {
    for(key in data) {
        this[key] = data[key];
    }
};

var JobCollection = function () {
    this.models = [];
    this.url = '/data.json'
};

JobCollection.prototype.fetch = function () {
    var models = this.models;
    return $.getJSON(this.url).success(function (data) {
        data.data.forEach(function (jobData) {
            models.push(new JobModel(jobData))
        })
    })
};

var JOB_VIEW_TYPES = {
    LIST: 0,
    CARD: 1
};

var JobViewSwitcher = React.createClass({

    onListViewClicked: function () {
        this.props.onChangeViewType(JOB_VIEW_TYPES.LIST)
    },

    onCardViewClicked: function () {
        this.props.onChangeViewType(JOB_VIEW_TYPES.CARD)
    },

    render: function () {
        return <nav id="job-view-switcher-anchor">
            <ul className="nav nav-pills pull-right">
                <li onClick={this.onListViewClicked} className={this.props.currentJobViewType == JOB_VIEW_TYPES.LIST ? 'active' : ''}>
                    <a href="javascript:void(0)">
                        <span className="glyphicon glyphicon-th-list"></span>
                    </a>
                </li>
                <li onClick={this.onCardViewClicked} className={this.props.currentJobViewType == JOB_VIEW_TYPES.CARD ? 'active' : ''}>
                    <a href="javascript:void(0)">
                        <span className="glyphicon glyphicon-th-large"></span>
                    </a>
                </li>
            </ul>
        </nav>
    }
});

var JobCardView = React.createClass({
    render: function() {
        return <h1>HEY I'M THE CARD VIEW</h1>
    }
});

var JobTableRow = React.createClass({
    render: function() {
        return <tr>
            <td>{this.props.job.name}</td>
            <td>{this.props.job.created_by_user.name}</td>
            <td>{moment(this.props.job.created_at).fromNow()}</td>
        </tr>
    }
});

var JobTable = React.createClass({
    render: function() {
        var rows = [];
        for (var i = 0; i < this.props.jobs.models.length; i++) {
            rows.push(<JobTableRow job={this.props.jobs.models[i]} />)
        }
        return <table className="table">
            <thead>
                <tr>
                    <th>Job Name</th>
                    <th>Creator</th>
                    <th>Last Modified</th>
                </tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>
    }
});

var Application = React.createClass({
    getInitialState: function () {
        return {
            currentJobViewType: JOB_VIEW_TYPES.LIST
        }
    },

    onChangeViewType: function (type) {
        this.setState({
            currentJobViewType: type
        });
    },

    render: function() {
        var jobView = this.state.currentJobViewType == JOB_VIEW_TYPES.LIST ? <JobTable className="row" jobs={this.props.jobs} /> : <JobCardView />;
        return <div>
            <div className="header clearfix">
                <JobViewSwitcher onChangeViewType={this.onChangeViewType} currentJobViewType={this.state.currentJobViewType} />
                <span className="aw-logo">
                    <img src="/img/aw-logo.gif" />
                </span>
            </div>
            {jobView}
        </div>
    }
});

(function() {
    var jobs = new JobCollection();

    jobs.fetch().done(function () {
        React.render(<Application jobs={jobs} />, $('.container').get(0));
    });
})();

