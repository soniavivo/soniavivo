import React, { useState, useEffect } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import _ from 'lodash';

import { getPages, Link, withPrefix } from '../utils';
import PortfolioItem from './PortfolioItem';

const PortfolioSection = (props) => {
  const section = _.get(props, 'section', null);
  const layout_style = _.get(section, 'layout_style', null) || 'mosaic';
  const show_filters = _.get(section, 'show_filters', false);
  const max_project_number = _.get(section, 'projects_number', null)

  const [filters, setFilters] = useState(() => ['all']);
  const [projects, setProjects] = useState();

  useEffect(() => {
    const projects_sorted = _.orderBy(getPages(props.pageContext.pages, '/portfolio'), 'frontmatter.date', 'desc');
    const filtered_projects = _.filter(projects_sorted, (project) => filters?.includes('all') || filters?.includes(project.frontmatter.type));
    setProjects(filtered_projects.slice(0, max_project_number));
  }, [filters]);

  const handleFilters = (event, newFormats) => {
    newFormats = newFormats || 'all';
    setFilters(newFormats);
  };

  return (
    <section id={_.get(section, 'section_id', null)} className="section section--portfolio">
      <div className="container container--lg">
        {_.get(section, 'title', null) && (
          <h2 className="section__title line-top">{_.get(section, 'title', null)}</h2>
        )}
        {_.get(section, 'subtitle', null) && (
          <p className="section__subtitle">{_.get(section, 'subtitle', null)}</p>
        )}
        {(show_filters === true) && (
          <ToggleButtonGroup value={filters} onChange={handleFilters} aria-label="text formatting" exclusive color="secondary">
            <ToggleButton color="primary" value="all" aria-label="design filter selection">
              All
            </ToggleButton>
            <ToggleButton value="design" aria-label="design filter selection">
              Design
            </ToggleButton>
            <ToggleButton value="branding" aria-label="branding filter selection">
              Branding
            </ToggleButton>
            <ToggleButton value="animation" aria-label="animation filter selection">
              Animation
            </ToggleButton>
          </ToggleButtonGroup>
        )}
        <div className={'grid portfolio-feed portfolio-feed--' + layout_style}>
          {
            _.map(projects, (project, project_idx) => (
              (((project_idx === max_project_number - 1) && _.get(section, 'view_all_label', null)) && _.get(section, 'view_all_url', null)) ? (
                <article key={project_idx} className="cell project-card">
                  <Link to={withPrefix(_.get(section, 'view_all_url', null))} className="project-card__view-all">
                    {_.get(project, 'frontmatter.thumb_image', null) && (
                      <div className="project-card__image">
                        <img src={withPrefix(_.get(project, 'frontmatter.thumb_image', null))} alt={_.get(project, 'frontmatter.thumb_image_alt', null)} />
                      </div>
                    )}
                    <span className="project-card__button">{_.get(section, 'view_all_label', null)}</span>
                  </Link>
                </article>
              ) :
                <PortfolioItem key={project_idx + '.1'} {...props} project_page={project} />
            ))}
        </div>
      </div>
    </section>
  );
}

export default PortfolioSection;