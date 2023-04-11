import { ElementRef, HostListener, Input, Renderer2, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  @Input('data') data: any[] = [];
  @Input('heading') heading:string ;
  @ViewChild('chart') barChart: ElementRef;
  private highestValue: string;
  private svg: any;
  private margin = 100;
  private width = 200 - this.margin *2 ;
  public noData:boolean = false ;
  private height = 200 - this.margin *2 ;
  public chartConfig: any = {
    margin: {
      top: 20,
      right: 10,
      bottom: 30,
      left: 50,
    },
    selectorHeight: 10
  };
  constructor(
    private renderer:Renderer2
  ) { }

  ngOnInit(): void {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    setTimeout(() => {
     this.alignChart();
    }, 100);
  }

  alignChart() {
    this.renderer.setProperty(this.barChart.nativeElement, 'innerHTML', " ")
    this.createSvg();
    this.drawBars(this.data);
  }
  
  ngAfterViewInit() {
    this.createSvg();
  }
  
  ngOnChanges(changes: any) {
    setTimeout(() => {
      this.prepareData();
      this.drawBars(this.data);

    }, 300);
  }

  prepareData() {
    let highestCurrentValue = 0;
    let tableLength = this.data?.length;
    this.data?.forEach((data, i) => {
      const barValue = Number(data?.value);
      if (barValue > highestCurrentValue) {
        highestCurrentValue = barValue;
      }
      if (tableLength == i + 1) {
        this.highestValue = highestCurrentValue.toString();
      }
    });
  }

  private createSvg(): void {
    this.autoalign();
    this.svg = null ;
    this.svg = this.barChart.nativeElement;
    this.svg = d3.select(this.svg);
    this.svg = this.svg?.append('svg');
    this.svg = this.svg?.attr('height',this.height+20).attr('width',this.width+10);
  }
  
  autoalign() {
    this.width =
    this.barChart?.nativeElement?.parentElement?.clientWidth -
    this.chartConfig.margin.left -
    this.chartConfig.margin.right;
    this.height =
    this.barChart?.nativeElement?.parentElement?.clientHeight -
    this.chartConfig.margin.top -
    this.chartConfig.margin.bottom - this.chartConfig.selectorHeight;
    if(this.height < 100 ) {
      this.height = 130 ;
    }

  }
  private drawBars(data: any[]): void {
    if(!data.length) {
      this.noData = true; 
      return 
    }
    // Creating X-axis band scale
    const x = d3
      .scaleBand()
      .range([0, this.width])
      .domain(data.map(d => d.name))
      .padding(0.2);

    // Drawing X-axis on the DOM
    this.svg
      .append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", "14px");

    // Create Y-axis band scale
    const y = d3
      .scaleLinear()
      .domain([0, Number(this.highestValue) + 50])
      .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg
      .append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "14px");

    // Create and fill the bars
    this.svg
      .selectAll("bars")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d: any) => x(d.name))
      .attr("y", (d: any) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d: any) =>
        y(d.value) <= this.height ? this.height - y(d.value) : this.height
      ) // this.height
      .attr("fill", (d: any) => d.color);

    this.svg
      .selectAll("text.bar")
      .data(data)
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .attr("fill", "#70747a")
      .attr("x", (d: any) => x(d.name) ? x(d.name) : 0 + 18)
      .attr("y", (d: any) => y(d.value) - 5)
      .text((d: any) => Math.round(d.value * 100) / 100);
  }

}
