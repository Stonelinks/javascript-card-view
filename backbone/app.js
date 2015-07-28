/**
 * Created by ld on 7/24/15.
 */

var Job = Backbone.Model.extend({});

var JobCollection = Backbone.Collection.extend({
    model: Job,

    url: '/data.json',

    parse: function(data) {
        return data.data;
    }
});

var CollectionView = Backbone.View.extend({
    childView: null,

    render: function() {
        this.$el.html('');
        this.collection.forEach(function(model) {
            var child = new this.childView({
                model: model
            });
            this.$el.append(child.render().el);
        }.bind(this));
        return this;
    }
});

var TableView = CollectionView.extend({
    tableHeadTemplate: null,

    render: function() {
        var rows = CollectionView.prototype.render.call(this).$el.html();
        this.$el.html('<table class="table"><thead><tr></tr></thead><tbody></tbody></table>')
            .find('thead tr').html(this.tableHeadTemplate())
            .closest('table')
            .find('tbody').html(rows);
        return this;
    }
});

var JOB_VIEW_TYPES = {
    LIST: 0,
    CARD: 1
};

var JobViewStateModel = Backbone.Model.extend({
    defaults: {
        JOB_VIEW_TYPES: JOB_VIEW_TYPES,
        currentJobViewType: JOB_VIEW_TYPES.LIST
    }
});

var JobViewSwitcher = Backbone.View.extend({
    template: makeUnderscoreTemplate('#job-view-switcher'),

    events: {
        'click .switch-to-list-view': 'switchToListView',
        'click .switch-to-card-view': 'switchToCardView'
    },

    switchToListView: function() {
        this.model.set('currentJobViewType', JOB_VIEW_TYPES.LIST);
    },

    switchToCardView: function() {
        this.model.set('currentJobViewType', JOB_VIEW_TYPES.CARD);
    },

    updateButtonClasses: function() {
        var currentJobViewType = this.model.get('currentJobViewType');
        this.$el.find('.switch-to-list-view')[currentJobViewType == JOB_VIEW_TYPES.LIST ? 'addClass' : 'removeClass']('active');
        this.$el.find('.switch-to-card-view')[currentJobViewType == JOB_VIEW_TYPES.CARD ? 'addClass' : 'removeClass']('active');
    },

    render: function() {
        this.$el.html(this.template());
        return this;
    }
});

var JobCardView = Backbone.View.extend({
    template: '<h1>HEY I\'M THE CARD VIEW</h1>',

    render: function() {
        this.$el.html(this.template);
        return this;
    }
});

var JobTableRowView = Backbone.View.extend({
    tagName: 'tr',

    template: makeUnderscoreTemplate('#job-table-row'),

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

var JobTableView = TableView.extend({
    tableHeadTemplate: makeUnderscoreTemplate('#job-table-row-head'),
    childView: JobTableRowView
});

var Application = function() {};

Application.prototype.start = function() {

    var $jobListAnchor = $('#job-list-anchor');
    var $jobViewSwitcherAnchor = $('#job-view-switcher-anchor');

    var jobs = new JobCollection();

    var jobViewState = new JobViewStateModel();

    var jobViewSwitcher = new JobViewSwitcher({
        model: jobViewState
    });

    var jobTable = new JobTableView({
        collection: jobs
    });

    var jobCards = new JobCardView({
        collection: jobs
    });

    $jobViewSwitcherAnchor.html(jobViewSwitcher.render().el);
    var _render = function() {
        var jobView = jobViewState.get('currentJobViewType') == JOB_VIEW_TYPES.LIST ? jobTable : jobCards;
        $jobListAnchor.html(jobView.render().el);
        jobViewSwitcher.updateButtonClasses();
    };

    jobViewState.on('change', _render);
    jobs.fetch().done(_render);
};

var app = new Application();
app.start();

function makeUnderscoreTemplate(templateSelector) {
    return _.template($(templateSelector).html());
}
