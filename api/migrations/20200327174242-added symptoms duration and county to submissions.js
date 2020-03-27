'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return [
            await queryInterface.describeTable('submissions').then(async attributes => {
                if (!attributes.county) {
                    await queryInterface.addColumn('submissions', 'county', {
                        type: Sequelize.TEXT,
                        allowNull: true
                    });
                }
                if (!attributes.symptoms_duration) {
                    await queryInterface.addColumn('submissions', 'symptoms_duration', {
                        type: Sequelize.INTEGER,
                        allowNull: true
                    });
                }
            })
        ]
    },

    down: async (queryInterface, Sequelize) => {
        return [
            await queryInterface.describeTable('submissions').then(async attributes => {
                if (attributes.county) {
                    await queryInterface.removeColumn('submissions', 'county');
                }
                if (attributes.symptoms_duration) {
                    await queryInterface.removeColumn('submissions', 'symptoms_duration');
                }
            })
        ]
    },
};
