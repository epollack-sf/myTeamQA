import { LightningElement, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import ChartJS from '@salesforce/resourceUrl/ChartJS';

// General Config
const CATEGORIES = ['Technical', 'Industry', 'Product', 'Discipline', 'Solution Engineering', 'Consulting', 'Customer Engagement', 'Sales'];
const MAX_LEVEL = 5;
const CHART_TITLE = 'Sum of Rating / Maximum Rating by Skill Category';
const LEGEND_TITLE = 'Employee:';
const LEGEND_BOX_BORDER_RADIUS = 2;
const POINT_STYLE = 'rectRot';
const POINT_HOVER_RADIUS = 5;
const LINE_WIDTH = 1;

// Colors
const TEXT_COLOR = '#444444';
const TICK_COLOR = 'rgb(116, 116, 116)';
const GRID_COLOR = 'rgba(116, 116, 116, 0.25)';
const AXIS_COLOR = 'rgba(254, 147, 57, 0.75)';
const BACKGROUND_COLOR = 'rgba(88, 103, 232, 0.7)';
const LINE_COLOR = 'rgba(216, 58, 0, 0.8)';

// Fonts
const FONT_FAMILY = 'sans-serif';
const BOLD_NORMAL = '600';
const BOLD = 'bold';
const BOLDEST = '900';

// Axes
const MIN = 0;
const MAX = 100;

export default class DeveloperCardRadarChart extends LightningElement {
    @api employee; // User object to extract info from
    _data;

    @api
    set skills(value) {
        const formattedData = [];

        for (let category of CATEGORIES) {
            formattedData.push({ category: category, ratingInfo: this.getRatingPercentage(value, category) });
        }

        this._data = formattedData;
    }

    get skills() {
        return this._data;
    }

    renderedCallback() {
        loadScript(this,`${ChartJS}/chart.js`)
            .then(() => this.initializeChart())
            .catch(e => this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: `Failed to load chart ${e.message}`,
                variant: 'error'
            })));
    }

    initializeChart() {
        // Callback Helper Functions
        const getCategoryData = (targetCategory) => this.skills.find(skill => skill.category === targetCategory);
        
        // Callbacks
        const getEveryEvenTick = function(value, index) {
            return index % 2 === 0 ? this.getLabelForValue(value) : '';
        };

        const tooltipTitle = (tooltipItems) => {
            const categoryData = getCategoryData(tooltipItems[0].label);

            if (!categoryData.ratingInfo.ratio) {
                return '';
            }
        }

        const tooltipLabel = (tooltipItems) => { // Start here
            return 'Hello';
        }

        const tooltipDescription = (tooltipItems) => {
            const categoryData = getCategoryData(tooltipItems[0].label);

            if (categoryData.ratingInfo.ratio) {
                return `Number of Skills in Category: ${categoryData.ratingInfo.numEntriesInCategory}\n` +
                    `Total Score in Category: ${categoryData.ratingInfo.sumRatingsInCategory}\n` +
                    `Maximum Possible Score from ${categoryData.ratingInfo.numEntriesInCategory} Skill(s): ${categoryData.ratingInfo.numEntriesInCategory * MAX_LEVEL}`;
            }
        };

        const hoverEffects = () => {
            if (skillChart.data.datasets[0].borderWidth !== 3 && 
                    skillChart.options.elements.point.radius !== 5) {
                skillChart.data.datasets[0].borderWidth = 3;
                skillChart.options.elements.point.radius = 5;
                
                skillChart.update();
            }
        };

        const legendLabelGenerator = (chart) => {
            return chart.data.datasets.map((dataset) => ({
                text: dataset.label,
                fillStyle: dataset.backgroundColor,
                strokeStyle: dataset.borderColor,
                borderWidth: dataset.borderWidth,
                borderRadius: LEGEND_BOX_BORDER_RADIUS
            }));
        };

        // Plugins
        const stopHoverEffects = {
            id: 'stopHover',
            beforeEvent(chart, args) {
                const event = args.event;
                
                if (event.type === 'mouseleave') {
                    chart.data.datasets[0].borderWidth = 1;
                    chart.options.elements.point.radius = 3;
                    
                    chart.update();
                }
            }
        };

        // Default Config
        Chart.defaults.font.family = FONT_FAMILY;
        Chart.defaults.font.color = TEXT_COLOR;
        
        // Chart Config
        const data = {
            labels: this.skills.map(entry => entry.category),
            datasets: [{
                label: `${this.employee.FirstName}`,
                data: this.skills.map(entry => entry.ratingInfo.ratio),
                borderColor: LINE_COLOR,
                borderWidth: LINE_WIDTH,
                backgroundColor: BACKGROUND_COLOR
            }]
        };

        const options = {
            responsive: false, // needed without LWS turned on
            events: [...Chart.defaults.events, 'mouseleave'],
            onHover: hoverEffects,
            elements: {
                point: {
                    pointStyle: POINT_STYLE,
                    hoverRadius: POINT_HOVER_RADIUS
                },
            },
            scales: {
                r: {
                    angleLines: {
                        color: AXIS_COLOR
                    },
                    grid: {
                        circular: true,
                        color: GRID_COLOR
                    },
                    pointLabels: {
                        font: {
                            weight: BOLD_NORMAL
                        }
                    },
                    ticks: {
                        color: TICK_COLOR,
                        callback: getEveryEvenTick
                    },
                    min: MIN,
                    max: MAX
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: CHART_TITLE,
                    font: {
                        weight: BOLDEST
                    }
                },
                legend: {
                    title: {
                        display: true,
                        text: LEGEND_TITLE,
                        font: {
                            weight: BOLD
                        }
                    },
                    labels: {
                        // onClick: hideDataset,
                        generateLabels: legendLabelGenerator
                    }
                },
                tooltip: {
                    events: ['click'],
                    callbacks: {
                        title: tooltipTitle,
                        label: tooltipLabel,
                        footer: tooltipDescription
                    }
                }
            }
        };
        
        // Chart Init
        const ctx = this.template.querySelector('canvas');
        const config = {
            type: 'radar',
            data: data,
            options: options,
            plugins: [stopHoverEffects]
        };

        const skillChart = new Chart(ctx, config);
    }

    getRatingPercentage(skills, category) {
        const entriesByCategory = skills.filter(skill => skill.SkillType === category);

        let numEntries = entriesByCategory.length;
        let sumRatings = entriesByCategory
                            .map(skill => parseInt(skill.SkillRating[0]))
                            .reduce((acc, currVal) => acc + currVal, 0);

        return { 
            numEntriesInCategory: numEntries,
            sumRatingsInCategory: sumRatings,
            ratio: (sumRatings / (MAX_LEVEL * numEntries)) * 100 || 0
        };
    }
}