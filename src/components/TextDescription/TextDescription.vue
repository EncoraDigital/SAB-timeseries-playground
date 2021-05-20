<template>
  <div id="text-description-wrapper">
    <LabelWithTip
      id="text-title"
      :style="style"
      :text-tip="false"
      text-label="The Time-Series playground"
    />
    <div id="text-description">
      <p>
        The Time Series Playground is an interactive opensource tool
        designed to provide intuition on how to train AutoRegressive
        Feed Forward Neural Networks for time series forecasting.
      </p>
      <p>
        Through the tool, one can define, configure, and train
        Neural Networks using four different time-series “toy”
        datasets. For each dataset, users can experiment with
        different kinds of input formats, and play with up to 5
        different training hyperparameters. For the latter,
        users can tweak:
      </p>
      <ul>
        <li>The <a href="https://en.wikipedia.org/wiki/Learning_rate">learning rate</a>.</li>
        <li>The choice of the <a href="https://en.wikipedia.org/wiki/Activation_function">activation function</a>.</li>
        <li>The number of neurons of the hidden layer of the MLP.</li>
        <li>The number of epochs to train the system.</li>
        <li>The size of the input at each iteration (batch size).</li>
        <li>The split proportion of training and testing data.</li>
        <li>
          The number of autoregressive lags which refers to
          the number of immediate past observations to be
          used to predict the next value in the series.
        </li>
        <li>
          The number of season lags which defines the number
          of past observations of the dataset seasonality
          to be used.
        </li>
      </ul>

      <p>
        Also, one can start, pause, or resume training
        at any given moment; or even choose to train a
        model for a single epoch at a time. When a
        given training process is finished or paused,
        the tool automatically displays one-step-ahead
        forecasting for the test set in the main
        graph, along with the <a
          href="https://en.wikipedia.org/wiki/Confidence_interval"
        >95% confidence intervals.</a>
      </p>

      <p>
        The main visualization graph allows users to interact
        with the seletec dataset and the model’s predictions. It
        displays the time-series in separate chunks of
        training and testing sets. Moreover, one can visualize single
        point values, zoom in to a particular section of
        the data, or choose to hide/show separate traces.
      </p>

      <p>
        Besides the hyperparameters, users can define their
        own choices of <a
          href="https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.train_test_split.html"
        >train and test splits</a>, or even customize the
        input data format to be used for training. For
        the <b>Input Format</b>, users can choose the number
        of immediate and seasonal past observations to be
        included in the input vector used to train the system.
      </p>

      <p>
        During training, the <b>Metrics</b> panel displays real-time updates for different <a
          href="https://robjhyndman.com/papers/foresight.pdf"
        > error metrics</a>. These include:
      </p>

      <ul>
        <li>ME (Mean Error)</li>
        <li>RMSE (Root Mean Squared Error)</li>
        <li>MAPE (Mean Absolute Percentage Error)</li>
        <li>MPE (Mean Percentage Error)</li>
        <li>MAE (Mean Squared Error)</li>
      </ul>

      <p>
        You can also see the distribution of errors (residuals)
        in the <b>Training Residuals</b> histogram.
      </p>

      <h2>Neural Network Auto-Regressive Models</h2>

      <p>
        The idea of a Neural Network Auto-Regressive (NNAR)
        is to use past observations to predict future
        behavior. In other words, we want to predict the
        next value, based on the last p observations. As
        an example, if we choose a value of <em>p</em>
        equals 4, the model receives as input a sequence
        of values like:
      </p>

      <br>
      <img
        alt="Image 1"
        class="img-fluid center"
        src="@/assets/Images/1.png"
      >
      <br>

      <p>and aims to forecast the next value of the sequence</p>

      <br>
      <img
        alt="Image 2"
        class="img-fluid center"
        src="@/assets/Images/2.png"
      >
      <br>

      <p>
        For seasonal data, it is helpful to add some
        historical observations from the same season
        as input. Let’s consider a monthly spaced time
        series with legged values <em>p = 3</em>. As we
        saw, the input vector would have lagged values
        as shown in the figure above. But in this case,
        we can also incorporate seasonal lagged values
        <em>P</em>. If we set <em>P</em> equals 2 for
        instance, our final input vector would look
        like:
      </p>

      <br>
      <img
        alt="Image 3"
        class="img-fluid"
        src="@/assets/Images/3.png"
      >
      <br>

      <p>
        In general, a NNAR model with <em>p</em>
        lagged values and <em>P</em> seasonal lagged
        values has input:
      </p>

      <br>
      <img
        alt="3"
        class="img-fluid"
        src="@/assets/Images/4.png"
      >
      <br>

      <p>
        Here, <em>m</em> is the <a href="https://robjhyndman.com/hyndsight/seasonal-periods/">frequency</a> of the time
        series — <em>for monthly seasonal data,
          that is equal to 12</em>. You can control
        the values for <em>p</em> and
        <em>P</em> using the fields AutoRegressive
        Lags and Seasonal Lags in the time-series playground.
      </p>

      <p>
        This implementation uses a
        <a href="https://en.wikipedia.org/wiki/Neural_network">Neural Network (NN)</a>
        with a single hidden layer as an auto-regressive model.
        We can control the capacity of the model by tweaking
        the number of neurons for the hidden layer.
      </p>

      <p>
        Each neuron in the neural network will linearly
        combine the input vector with a set of randomly
        initialized
        weights. Then, a non-linear function like the <a
          href="https://en.wikipedia.org/wiki/Sigmoid_function"
        >sigmoid</a> or the <a
          href="https://en.wikipedia.org/wiki/Rectifier_(neural_networks)"
        >ReLU</a> is applied to transform the
        feature space in a non-linear fashion. In the end,
        the NN outputs a single value that corresponds to the next
        value prediction.
      </p>

      <br>
      <img
        alt="Image 5"
        class="img-fluid"
        src="@/assets/Images/5.png"
      >
      <br>

      <p>
        That is it! Feel free to play around with the tool
        and you can submit pull requests to this repository if you
        think something is not working properly.
      </p>

      <p>
        For an excellent free resource on Timeseries
        forecasting, check out professors Rob J Hyndman
        and George Athanasopoulos <a href="https://otexts.com/fpp2/">
          Forecasting: Principles and Practice</a> book.
      </p>
    </div>
  </div>
</template>

<script>
import LabelWithTip from '@/components/LabelWithTip/LabelWithTip';
import './style.sass';

export default {
  name: 'TextDescription',
  components: { LabelWithTip },
  data() {
    return {
      style: {
        fontSize: '4.250em',
      },
    };
  },
};
</script>

<style>
</style>
